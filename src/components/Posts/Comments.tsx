import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, CircleX, Loader2, MessageCircleIcon, MessageCirclePlusIcon } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { User } from "@/state/Comments/GetSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import HoverCardProfile from "./HoverCardProfile";
import { Badge } from "../ui/badge";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { clearMessageAndError, createComment } from "@/state/Comments/CreateSlice";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";



interface CommentsProps {
    postId: string;
    commentsCount: number;
    poster: User;
}

const formSchema = z.object({
    content: z.string().min(1, {
        message: "Content is required",
    }),
});


const Comments: React.FC<CommentsProps> = ({ postId, commentsCount, poster }) => {

    const [comments, setComments] = useState<any[] | []>([])
    const [loading, setLoading] = useState<boolean>(false)
    const message = useSelector((state: RootState) => state.createComment.message);
    const error = useSelector((state: RootState) => state.createComment.error);
    const dispatch = useDispatch<AppDispatch>()
    const { toast } = useToast();


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

    const getComments = async (postId: string) => {
        try {
            setLoading(true)
            const commentsQuery = query(collection(db, "posts", postId, 'comments'), orderBy("createdAt", "desc"));
            const querySnapshot2 = await getDocs(commentsQuery);
            const commentsPromises = querySnapshot2.docs.map(async (currentDoc) => {
                const commentData = currentDoc.data();
                const userRef2 = doc(db, "employees", commentData.sender);
                const userDoc2 = await getDoc(userRef2);
                const commenter = userDoc2.data();

                const createdAt: string = commentData.createdAt.toDate();
                const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
                return {
                    ...commentData,
                    createdAt: commentData.createdAt.toDate().toISOString(),
                    timeAgo,
                    commenter,
                };
            });
            const comments = await Promise.all(commentsPromises);
            setComments(comments);
            setLoading(false)
        } catch (error: any) {
            console.log({ code: "500", message: error.message });
        }
    };


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        console.log(values)
        const data = {
            postId: postId,
            docId: crypto.randomUUID(),
            content: values.content,
            sender: poster.email,
        }
        dispatch(createComment(data))
        getComments(postId)
        // Reset the form values
        form.reset({
            content: "",
        });
    }


    return (
        <>
            <Toaster />
            < Drawer >
                <DrawerTrigger>
                    <div onClick={() => getComments(postId)} className="flex gap-1 justify-center items-center text-muted-foreground hover:text-blue-400 cursor-pointer">
                        <MessageCircleIcon size={18} />
                        {comments.length !== 0 ? comments.length : commentsCount}
                    </div>
                </DrawerTrigger>
                <DrawerContent className="h-3/4">
                    <DrawerHeader className="flex flex-col gap-3 py-1">
                        <DrawerTitle className="px-2">{comments.length !== 0 ? comments.length : commentsCount}  Comments</DrawerTitle>
                        {/* //! Define add comment form. */}
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex gap-5 p-2"
                            >
                                <Avatar className="w-10 h-10 flex items-center justify-center">
                                    <AvatarImage loading="lazy" src={poster.avatar} className="object-cover" />
                                    <AvatarFallback className="text-base">
                                        {poster.firstName?.charAt(0).toUpperCase()}
                                        {poster.lastName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                {/* <Input placeholder="Add Comment..." {...field} /> */}
                                                <textarea
                                                    placeholder="Add Comment..."
                                                    {...field}
                                                    className="w-full h-auto min-h-10 bg-background ring-0 outline-none border-primary focus:border-b-2 rounded-md resize-none"
                                                    onInput={e => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        target.rows = 1;
                                                        const rows = target.scrollHeight / 20;
                                                        target.rows = rows;
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button size="sm" type="submit">
                                    <MessageCirclePlusIcon size={20} />
                                </Button>
                            </form>
                        </Form>
                    </DrawerHeader>
                    {/* //! Comments Section */}
                    {
                        loading ?
                            <div className="h-full w-full flex justify-center items-center">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            </div>
                            :
                            <ScrollArea className="h-full w-full rounded-md border py-4">
                                {comments.length === 0 ?
                                    <p className="w-full h-full flex justify-center items-center">No Comments</p>
                                    :
                                    comments?.map((item, index) => {
                                        return (
                                            <div key={index} className="flex flex-col px-6 py-2">
                                                <div className="flex gap-6 items-center">
                                                    <HoverCardProfile user={item.commenter}>
                                                        <Avatar className="w-10 h-10 flex items-center justify-center">
                                                            <AvatarImage loading="lazy" src={item.commenter?.avatar} className="object-cover" />
                                                            <AvatarFallback className="text-base">
                                                                {item.commenter?.firstName?.charAt(0).toUpperCase()}
                                                                {item.commenter?.lastName?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </HoverCardProfile>
                                                    <div className="flex gap-2">
                                                        <b>{item.commenter?.firstName} {item.commenter?.lastName}</b>
                                                        <i><small className="text-accent-foreground font-extralight">{item.timeAgo}</small></i>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col ml-16 text-sm select-text">
                                                    <span>{item.content}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </ScrollArea>
                    }
                    <DrawerFooter>
                        <DrawerClose>
                            <Badge variant="outline" className="p-2 px-10 rounded-md">Cancel</Badge>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer >
        </>
    )
}

export default Comments;