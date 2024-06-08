import { CheckCircle2, CircleX, HeartIcon } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { useToast } from "../ui/use-toast";
import { addLike, clearMessageAndError } from "@/state/Posts/UpdateSlice";
import '@/style/PostStyle.css'



interface LikesProps {
    postId: string;
}


const Likes: React.FC<LikesProps> = ({ postId }) => {

    const [hasLiked, setHasLiked] = useState<boolean>(() => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        return likedPosts.includes(postId);
    });
    const [likes, setLikes] = useState<number>(0)
    const message = useSelector((state: RootState) => state.updatePost.message);
    const error = useSelector((state: RootState) => state.updatePost.error);
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

    useEffect(() => {
        getLikes(postId);
    }, [postId]);

    const getLikes = (postId: string) => {
        const postRef = doc(db, 'posts', postId);
        onSnapshot(postRef, (postSnapshot) => {
            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                const likes = postData?.likes || 0;
                setLikes(likes);
            } else {
                console.log(`No document found with id: ${postId}`);
            }
        }, (error) => {
            console.log({ code: "500", message: error.message });
        });
    };


    const handleLike = async (postId: string) => {
        if (!hasLiked) {
            await dispatch(addLike(postId, 1));
            setHasLiked(true);
        } else {
            await dispatch(addLike(postId, -1));
            setHasLiked(false);
        }
        await getLikes(postId);
    }



    return (
        <>
            <div onClick={() => handleLike(postId)} className="flex gap-1 justify-center items-center text-muted-foreground hover:text-rose-500 cursor-pointer">
                {
                    hasLiked ?
                        <HeartIcon fill="rgb(244,63,94)" size={18} className={`text-rose-500 ${hasLiked ? 'heartBeat' : ''}`} /> :
                        <HeartIcon size={18} />
                }
                <span className={hasLiked ? `text-rose-500` : ""}>{likes}</span>
            </div >
        </>
    )
}

export default Likes;