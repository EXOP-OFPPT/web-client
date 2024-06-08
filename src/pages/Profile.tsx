import Navbar from "@/components/Profile/Navbar";
import AvatarComponent from "@/components/Profile/Avatar";
import Details from "@/components/Profile/Details";
import States from "@/components/Profile/States";
import Charts from "@/components/Profile/Charts";
import History from "@/components/Profile/History";
import { ScrollArea } from "@/components/ui/scroll-area";
import Actions from "@/components/Profile/Actions";

const Profile = () => {
  return (
    <>
      <ScrollArea className="h-screen w-full rounded-md border p-4 flex">
        <div className="w-full flex flex-col justify-center items-center gap-5 text-center py-5">
          <Navbar />
          <div className="w-full xlg:w-4/5 md:w-11/12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <AvatarComponent />
            <Details />
            <States />
          </div>
        </div>
        <History />
        <Charts />
        <Actions />
      </ScrollArea>
    </>
  );
};

export default Profile;
