// import Update from "./Update";
import Delete from "./Delete";
import Cookies from "universal-cookie";
import { useState } from "react";
import { PostType } from "@/state/Posts/GetSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MoreHorizontalIcon } from "lucide-react";

import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import HoverCardProfile from "./HoverCardProfile";
import Comments from "./Comments";
import Likes from "./Likes";
const cookies = new Cookies(null, { path: "/" });




type PostCardProps = {
  data: PostType;
};

const PostCard: React.FC<PostCardProps> = ({ data }) => {
  const user = cookies.get("user");
  const [isTextShown, setIsTextShown] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);


  return (
    <div className="flex flex-col sm:min-w-40 py-2">
      <main className="flex">
        {/* //! Avatar Sender Post Section */}
        <section className="w-16 flex justify-center">
          <HoverCardProfile user={data.poster}>
            <Avatar className="w-11 h-11 my-2 flex items-center justify-center cursor-pointer">
              <AvatarImage loading="lazy" src={data.poster?.avatar} className="object-cover" />
              <AvatarFallback className="text-base">
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
                    <Popover>
                      <PopoverTrigger>
                        <Badge variant="outline" className="p-1 rounded-full">
                          <MoreHorizontalIcon size={18} className="hover:text-primary" />
                        </Badge>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit px-5 py-2">
                        <Delete docId={data.id} fileName={data.attachement.fileName} />
                      </PopoverContent>
                    </Popover>
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
            {
              imageLoaded && data.attachement.url ?
                <img
                  loading="lazy"
                  src={data.attachement.url}
                  className="object-cover w-full h-auto max-h-[700px] border-2 border-border rounded-md"
                  onError={() => setImageLoaded(false)}
                />
                :
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-[500px] rounded-xl" />
                </div>
            }
            {/* <img loading="lazy" src={data.attachement.url} className="object-cover w-full h-auto max-h-[700px] border-2 border-border rounded-md" /> */}
          </div>
          {/* //! Actions Post Section */}
          <div className="flex gap-24 justify-center items-center py-2">
            {/* //! Likes Section */}
            <Likes currentLikes={data.likes} postId={data.id} />
            {/* //! Comments Section */}
            <Comments postId={data.id} commentsCount={data.commentsCount} poster={data.poster} />
          </div>
        </section>
      </main>
    </div >
  );
};

export default PostCard;
