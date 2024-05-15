import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import PostCard from "./PostCard";
import { Card } from "../ui/card";

export default function DisplayPostsCards() {
  const data = useSelector((state: RootState) => state.getPosts.posts);

  return (
    <div className="w-full h-auto flex justify-center pb-10 mt-24">
      <Card className="w-auto max-w-[900px] bg-transparent prr-16">
        {data.map((item:any, index:any) => {
          return <PostCard key={index} data={item} />;
        })}
        {/* {data.map((item, index) => {
          return <PostCard key={index} data={item} />;
        })} */}
      </Card>
    </div>
  );
}
