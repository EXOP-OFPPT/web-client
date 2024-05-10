import { EmployeeType } from "@/state/Employees/GetSlice";
import { Card } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Update from "./Update";
import Delete from "./Delete";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

type ProfileCardProps = {
  data: EmployeeType;
};


const ProfileCard: React.FC<ProfileCardProps> = ({ data }) => {
  const user = cookies.get("user");

  return (
    <Card className="flex flex-col gap-1 justify-between sm:min-w-36 py-2">
      <div className="flex justify-end items-center gap-1 px-3">
        {user.role === "admin" &&
          <>
            {/*//! I coment the TooltipComponent beacause it due an instead button error */}
            {/* <TooltipComponent title="Edit"> */}
            <Update mode={"ghost"} info={data} />
            {/* </TooltipComponent> */}
            {/* <TooltipComponent title="Delete"> */}
            <Delete mode={"ghost"} docId={data.email} />
            {/* </TooltipComponent> */}
          </>
        }
      </div>
      <Separator orientation="horizontal" />

      <div className="p-4 flex flex-col items-center">
        <Avatar className="w-32 h-32 flex items-center justify-center">
          <AvatarImage loading="lazy" src={data.avatar} className="object-cover" />
          <AvatarFallback className="text-4xl">
            {data?.firstName?.charAt(0).toUpperCase()}
            {data?.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* <img
        loading="lazy"
          src={
            "https://firebasestorage.googleapis.com/v0/b/exop-d02fc.appspot.com/o/EXOP.jpg?alt=media&token=1a450e62-54b9-4792-bc66-852653aac8ed"
          }
          alt={data.firstName}
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
        /> */}
        <div className="text-center">
          <h2 className="text-xl font-bold capitalize ">
            {data.firstName} {data.lastName}
          </h2>
          <Badge
            variant={data.role == "admin" ? "destructive" : "secondary"}
            className="capitalize"
          >
            {data.role}
          </Badge>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-1">
              Finis<div className="text-xl font-bold">{5}</div>
            </div>
            <div className="p-1">
              En cours
              <div className="text-xl font-bold">{2}</div>
            </div>
            <div className="p-1">
              Non-Finis<div className="text-xl font-bold">{1}</div>
            </div>
          </div>

          <div className="mt-5">
            <p className="">Productivite</p>
          </div>
          {/* <div className="mt-4 w-full bg-gray-200 rounded-lg">
            <div
              className="h-2 bg-blue-500 rounded-lg"
              style={{ width: `${data.progress * 10}%` }}
            ></div>
          </div> */}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
