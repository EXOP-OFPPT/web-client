import React, { useRef, useState } from "react";
import { Camera, CheckCircle2, CircleX, Loader2, UploadCloud } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "../ui/card";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { updatePhotoProfile } from "@/state/auth/AuthSlice";
import { useToast } from "../ui/use-toast";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

const AvatarComponent: React.FC = () => {
  const user = cookies.get("user");
  const [loading, setLoading] = useState<boolean>(false);
  const storage = getStorage();
  const fileInput = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Upload image to firebase storage
  const uploadImage = async (imageUpload: File) => {
    const imageSize = Number((imageUpload.size / (1024 * 1024)).toFixed(2));
    console.log(imageSize);
    if (!imageUpload) return;
    if (imageSize > 1.1) {
      return toast({
        variant: "default",
        title: `Image size is ${imageSize}MB`,
        description: "Image size must be less than 1.5MB",
        className: "text-error border-2 border-error text-start",
        icon: <CircleX size={40} className="mr-2" />,
      });
    }
    const storageRef = ref(storage, `Avatars/${crypto.randomUUID() + imageUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toast({
          variant: "default",
          title: "Upload progress",
          description: "Upload is " + progress.toFixed(2) + "% done",
          className:
            "text-secondary-foreground border-2 border-secondary-foreground text-start",
          icon: <UploadCloud size={40} className="mr-2" />,
        });
        switch (snapshot.state) {
          case "paused":
            setLoading(false)
            console.log("Upload is paused");
            break;
          case "running":
            setLoading(true)
            console.log("Upload is running");
            break;
        }
      },
      () => {
        // Error
        toast({
          variant: "default",
          title: "Upload Failed",
          description: "Upload failed! Please try again.",
          className: "text-error border-2 border-error text-start",
          icon: <CircleX size={40} className="mr-2" />,
        });
      },
      () => {
        // Complete
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          await dispatch(updatePhotoProfile(downloadURL, user?.email));
          toast({
            variant: "default",
            title: "Update Profile",
            description: "Profile updated successfully!",
            className: "text-primary border-2 border-primary text-start",
            icon: <CheckCircle2 size={40} className="mr-2" />,
          });
          setLoading(false)
        });
      }
    );
  };

  return (
    <Card className="rounded-lg shadow-lg p-10">
      <div className="font-bold pb-7 uppercase">Image de profile</div>
      <div className="flex flex-col items-center px-7  mt-7 mb-8">
        {loading ?
          <Loader2 className="h-40 w-40 text-primary animate-spin" />
          : <Avatar className="w-60 h-60 flex items-center justify-center">
            <AvatarImage loading="lazy" src={user?.avatar} className="object-cover" />
            <AvatarFallback className="text-6xl">
              {user?.firstName?.charAt(0).toUpperCase()}
              {user?.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>}
      </div>
      <div className="flex justify-center">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e: any) => {
            uploadImage(e.target.files[0]);
          }}
        />
        <button
          onClick={() => fileInput.current?.click()}
          className="flex font-semibold capitalize text-blue-500 text-center"
        >
          <Camera className="h-6 w-6" />
          changer l'image de profile
        </button>
      </div>
    </Card>
  );
};

export default AvatarComponent;
