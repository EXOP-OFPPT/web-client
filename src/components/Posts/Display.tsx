import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import PostCard from "./PostCard";
import { Card } from "../ui/card";
import { PostType } from "@/state/Posts/GetSlice";

export default function DisplayPostsCards() {
  const data = useSelector((state: RootState) => state.getPosts.posts);

  return (
    <div className="w-full h-auto flex justify-center py-5">
      <Card className="w-auto max-w-[900px] bg-transparent pr-5">
        {data.map((item: PostType, index: number) => {
          return <PostCard key={index} data={item} />;
        })}
        {/* {data.map((item, index) => {
          return <PostCard key={index} data={item} />;
        })} */}
      </Card>
    </div>
  );
}
