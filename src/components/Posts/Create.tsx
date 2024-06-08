"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/state/store";
import {
  Loader2,
  CheckCircle2,
  CircleX,
  ImagePlusIcon,
  UploadCloudIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { clearMessageAndError, createPost } from "@/state/Posts/CreateSlice";
import { getPosts } from "@/state/Posts/GetSlice";
import { UserInterface } from "@/state/Auth/AuthSlice";


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
});


const Create = () => {
  const user = useSelector((state: RootState) => state.auth.user) as UserInterface;
  const [loading, setLoading] = useState(false)
  const message = useSelector(
    (state: RootState) => state.createPost.message
  );
  const storage = getStorage();
  const [file, setFile] = useState<File>({} as File);
  const error = useSelector((state: RootState) => state.createPost.error);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Then, in your component
  useEffect(() => {
    if (message) {
      toast({
        variant: "default",
        title: "Action dispatched",
        description: message,
        className: "text-primary border-2 border-primary text-start",
        icon: <CheckCircle2 size={40} className="mr-2" />,
      });
      dispatch(clearMessageAndError());
    } else if (error) {
      toast({
        variant: "default",
        title: "Action Failed",
        description: error?.message,
        className: "text-error border-2 border-error text-start",
        icon: <CircleX size={40} className="mr-2" />,
      });
      dispatch(clearMessageAndError());
    }
  }, [message, error]);


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Post 5",
      description: "Description Post 5",
    },
  });


  //! Upload image to firebase storage
  const uploadImage = async (imageUpload: File, values: z.infer<typeof formSchema>) => {
    const imageSize = Number((imageUpload.size / (1024 * 1024)).toFixed(2));
    const maxSize = 50
    console.log(imageSize, " MB");
    if (!imageUpload) return;
    if (imageSize > maxSize) {
      return toast({
        variant: "default",
        title: `Image size is ${imageSize}MB`,
        description: `Image size must be less than ${maxSize}MB`,
        className: "text-error border-2 border-error text-start",
        icon: <CircleX size={40} className="mr-2" />,
      });
    }
    const fileName = crypto.randomUUID() + imageUpload.name;
    const storageRef = ref(storage, `Posts/Images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //! Progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toast({
          variant: "default",
          title: "Upload progress",
          description: "Upload is " + progress.toFixed(2) + "% done",
          className:
            "text-secondary-foreground border-2 border-secondary-foreground text-start",
          icon: <UploadCloudIcon size={40} className="mr-2" />,
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
        //! Error
        toast({
          variant: "default",
          title: "Upload Failed",
          description: "Upload failed! Please try again.",
          className: "text-error border-2 border-error text-start",
          icon: <CircleX size={40} className="mr-2" />,
        });
      },
      () => {
        //! Complete
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          const attachement = { type: "image", fileName: fileName, url: downloadURL }
          // Create Post Doc
          if (attachement.url) {
            const docId = crypto.randomUUID();
            const postData = {
              id: docId,
              title: values.title,
              description: values.description,
              sender: user?.email,
              likes: 0,
              attachement: attachement,
            };
            dispatch(createPost({ ...postData }));
            dispatch(getPosts());
            setFile({} as File)
          }
          toast({
            variant: "default",
            title: "Post Uploaded",
            description: "Post Attachement Uploaded successfully!",
            className: "text-primary border-2 border-primary text-start",
            icon: <CheckCircle2 size={40} className="mr-2" />,
          });
          setLoading(false)
        });
      }
    );
  };


  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    uploadImage(file, values)
  }

  return (
    <div className="pointer-events-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <ImagePlusIcon size={20} className="mr-2" />
            <span>Create Post</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[650px] sm:max-w-[700px] px-1">
          <ScrollArea className="h-full w-full p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-primary text-2xl">
                Create Post
              </DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new Post.
              </DialogDescription>
            </DialogHeader>
            {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"> */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 px-2 my-2"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => setFile(e.target.files[0])}
                  placeholder="Attachement"
                />
                {loading ? (
                  <Button disabled>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    <span>Creating Post...</span>
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </form>
            </Form>
            {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
          </ScrollArea>
        </DialogContent>
      </Dialog >
    </div>
  );
}

export default Create;
