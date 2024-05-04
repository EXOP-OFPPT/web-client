import React, { useRef } from "react";
import { Camera, CheckCircle2, CircleX, UploadCloud } from "lucide-react";
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
import Cookies from "universal-cookie";
import { useToast } from "../ui/use-toast";
const cookies = new Cookies(null, { path: "/" });

const AvatarComponent: React.FC = () => {
  const user = cookies.get("user");
  const storage = getStorage();
  const fileInput = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Upload image to firebase storage
  const uploadImage = async (imageUpload: File) => {
    if (!imageUpload) return;
    const storageRef = ref(storage, `Avatars/${imageUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toast({
          variant: "default",
          title: "Upload progress",
          description: "Upload is " + progress + "% done",
          className:
            "text-secondary-foreground border-2 border-secondary-foreground text-start",
          icon: <UploadCloud size={40} className="mr-2" />,
        });
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
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
          await dispatch(updatePhotoProfile(downloadURL, user.email));
          toast({
            variant: "default",
            title: "Update Profile",
            description: "Profile updated successfully!",
            className: "text-primary border-2 border-primary text-start",
            icon: <CheckCircle2 size={40} className="mr-2" />,
          });
        });
      }
    );
  };

  return (
    <Card className="rounded-lg shadow-lg p-10">
      <div className="font-bold pb-7 uppercase">Image de profile</div>
      <div className="flex flex-col items-center px-7 ">
        <Avatar className="w-40 h-40 flex items-center justify-center">
          <AvatarImage loading="lazy" src={user.photoURL} className="object-cover" />
          <AvatarFallback className="text-6xl">
            {user?.firstName?.charAt(0).toUpperCase()}
            {user?.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
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
