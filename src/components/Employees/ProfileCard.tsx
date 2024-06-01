import { EmployeeType } from "@/state/Employees/GetSlice";
import { Card } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Update from "./Update";
import Delete from "./Delete";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getTasks } from "@/state/Tasks/GetSlice";
const cookies = new Cookies(null, { path: "/" });

type ProfileCardProps = {
  data: EmployeeType;
};


const ProfileCard: React.FC<ProfileCardProps> = ({ data }) => {
  const user = cookies.get("user");
  const tasks = useSelector((state: RootState) => state.getTasks.tasks);
  const verified = tasks.filter((task) => task.status === "verified" && task.assignedTo === data.email);
  const done = tasks.filter((task) => task.status === "done" && task.assignedTo === data.email);
  const inProgress = tasks.filter((task) => task.status === "inprogress" && task.assignedTo === data.email);
  const todo = tasks.filter((task) => task.status === "todo" && task.assignedTo === data.email);
  const [productivity, setProductivity] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getTasks())
  }, [dispatch])

  useEffect(() => {
    const currentProductivity = (
      (verified.length * 1.0 +
        done.length * 0.75 +
        inProgress.length * 0.5 +
        todo.length * 0.0) /
      (tasks.length * 1.0)
    ) * 100;
    setProductivity(currentProductivity);
  }, [tasks]);


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
          <AvatarImage loading="lazy" src={data.avatar?.photoURL} className="object-cover" />
          <AvatarFallback className="text-4xl">
            {data?.firstName?.charAt(0).toUpperCase()}
            {data?.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
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
              Verified<div className="text-xl font-bold">{verified.length}</div>
            </div>
            <div className="p-1">
              Done<div className="text-xl font-bold">{done.length}</div>
            </div>
            <div className="p-1">
              In Progress
              <div className="text-xl font-bold">{inProgress.length}</div>
            </div>
            <div className="p-1">
              Todo<div className="text-xl font-bold">{todo.length}</div>
            </div>
          </div>

          <div className="mt-5">
            <p className="">Productivite</p>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-lg">
            <div
              className="h-2 bg-blue-500 rounded-lg"
              style={{ width: `${productivity}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
