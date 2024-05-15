// import Update from "./Update";
import Delete from "./Delete";
import Cookies from "universal-cookie";
import { ReactNode, useState } from "react";
import { PostType, User } from "@/state/Posts/GetSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "../ui/badge";
const cookies = new Cookies(null, { path: "/" });


interface HoverCardProfileProps {
  user: User | undefined;
  children: ReactNode;
}

type PostCardProps = {
  data: PostType;
};


const HoverCardProfile: React.FC<HoverCardProfileProps> = ({ user, children }) => {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="flex items-center gap-2">
        <Avatar className="w-11 h-11 my-2 flex items-center justify-center">
          <AvatarImage loading="lazy" src={user?.avatar} className="object-cover" />
          <AvatarFallback className="text-6xl">
            {user?.firstName?.charAt(0).toUpperCase()}
            {user?.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <b>{user?.firstName} {user?.lastName}</b>
          <Badge className="w-fit" variant={"outline"}>{user?.role}</Badge>
          <small className="text-muted-foreground">{user?.email}</small>
          <small className="text-muted-foreground">{user?.phone}</small>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}


const PostCard: React.FC<PostCardProps> = ({ data }) => {
  const user = cookies.get("user");
  const [isTextShown, setIsTextShown] = useState(false);
  const [showComments, setShowComments] = useState(false);


  return (
    <div className="flex flex-col sm:min-w-40 py-2">
      <main className="flex">
        {/* //! Avatar Sender Post Section */}
        <section className="w-16 flex justify-center">
          <HoverCardProfile user={data.poster}>
            <Avatar className="w-11 h-11 my-2 flex items-center justify-center cursor-pointer">
              <AvatarImage loading="lazy" src={data.poster?.avatar} className="object-cover" />
              <AvatarFallback className="text-6xl">
                {data.poster?.firstName?.charAt(0).toUpperCase()}
                {data.poster?.lastName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </HoverCardProfile>
        </section>
        {/* //! Post Section */}
        <section className="flex-1">
          {/* //! Details Post Section */}
          <div className="pt-1 flex flex-col justify-center">
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-4 items-center">
                <HoverCardProfile user={data.poster}>
                  <b className="text-sm font-bold cursor-pointer">{data.poster?.firstName} {data.poster?.lastName}</b>
                </HoverCardProfile>
                <small className="text-muted-foreground"><i>{data.timeAgo}</i></small>
              </div>
              <span className="mx-4">
                {
                  user.role === "admin" &&
                  <>
                    <Delete mode="outline" docId={data.id} />
                  </>
                }
              </span>
            </div>
            <span className="text-sm font-medium ">{data.title}</span>
            <div className="flex-shrink min-w-0">
              <span className={`text-sm text-muted-foreground font-medium overflow-hidden ${isTextShown ? '' : 'whitespace-nowrap'}`}>
                {data.description.repeat(1)}
              </span>
              <button className="text-blue-500 text-sm ml-1" onClick={() => setIsTextShown(!isTextShown)}>
                {isTextShown ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
          {/* //! Attachement Post Section */}
          <div className="pt-5">
            <img loading="lazy" src={data.attachement.url} className="object-cover w-full h-auto max-h-[700px] border-2 border-border rounded-md" />
          </div>
          {/* //! Actions Post Section */}
          <div className="flex gap-24 justify-center items-center py-2">
            <div className="flex gap-1 justify-center items-center text-muted-foreground hover:text-rose-500 cursor-pointer">
              <HeartIcon size={18} />
              {data.likes}
            </div>
            <div onClick={() => setShowComments(prev => !prev)} className="flex gap-1 justify-center items-center text-muted-foreground hover:text-blue-400 cursor-pointer">
              <MessageCircleIcon size={18} />
              {data.comments?.length}
            </div>
          </div>
        </section>
      </main>
      {/* //! Comments Section */}
      {showComments &&
        <section className="">
          {data.comments?.map((item, index) => {
            return (
              <div key={index} className="flex flex-col px-10 py-3 border-t-2">
                <div className="flex gap-2 items-center">
                  <HoverCardProfile user={item.commenter}>
                    <Avatar className="w-10 h-10 flex items-center justify-center">
                      <AvatarImage loading="lazy" src={data.poster?.avatar} className="object-cover" />
                      <AvatarFallback className="text-6xl">
                        {data.poster?.firstName?.charAt(0).toUpperCase()}
                        {data.poster?.lastName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </HoverCardProfile>
                  <HoverCardProfile user={item.commenter}>
                    <b>{item.commenter?.firstName} {item.commenter?.lastName}</b>
                  </HoverCardProfile>
                  <small className="text-accent-foreground"><i>{item.timeAgo}</i></small>
                </div>
                <div className="flex flex-col ml-12 text-sm">
                  <span>{item.content}</span>
                </div>
              </div>
            );
          })}
        </section>
      }
    </div>
  );
};

export default PostCard;
