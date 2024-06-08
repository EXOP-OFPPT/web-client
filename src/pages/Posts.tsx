import DisplayPostsCards from "@/components/Posts/Display";
import AddPost from "@/components/Posts/Create";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch, RootState } from "@/state/store";
import { CheckCircle2, CircleX, ImageOffIcon, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessageAndError, getPosts } from "@/state/Posts/GetSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const Posts: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const posts = useSelector((state: RootState) => state.getPosts.posts);
    const isloading = useSelector((state: RootState) => state.getPosts.loading);
    const message = useSelector((state: RootState) => state.getPosts.message);
    const error = useSelector((state: RootState) => state.getPosts.error);
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();

    useEffect(() => {
        if (posts.length === 0) {
            dispatch(getPosts());
        }
    }, [dispatch]);

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

    return (
        <>
            <div className="h-[calc(100vh-4rem)] flex flex-col items-center">
                {/* Header */}
                <Card className="pointer-events-none fixed bg-transparent shadow-none border-none z-10 w-full xlg:w-4/5 md:w-11/12 flex justify-between items-end px-4 py-5">
                    <div className="flex flex-col items-start">
                        <h6>Page</h6>
                        <h3 className="text-4xl font-bold text-primary">Posts</h3>
                    </div>
                    <div className="h-full flex flex-col justify-center gap-2">
                        {user?.role === "admin" && <AddPost />}
                    </div>
                </Card>

                {/* Table */}
                {isloading ? (
                    <>
                        <Loader2 className="h-10 w-10 mt-96 text-primary animate-spin" />
                    </>
                ) : (
                    <>
                        {
                            (posts.length === 0) ?
                                <Alert className="w-fit px-32 py-16 mt-32 flex flex-col justify-center items-center gap-5">
                                    <AlertTitle className="text-2xl">No posts yet</AlertTitle>
                                    <AlertDescription className="flex justify-center items-center">
                                        <ImageOffIcon className="h-60 w-60 text-muted-foreground" />
                                    </AlertDescription>
                                </Alert>
                                :
                                <DisplayPostsCards />
                        }
                    </>
                )}
            </div>
        </>
    );
};

export default Posts;



