import React, { useEffect, useState } from "react";
import { BadgeCheck, CheckCircle2, CircleX, Clock } from "lucide-react";
import { Card } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getTasks } from "@/state/Tasks/GetSlice";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

type StatesProps = {};

const States: React.FC<StatesProps> = () => {
  const user = cookies.get("user");

  const tasks = useSelector((state: RootState) => state.getTasks.tasks);
  const verified = tasks.filter((task) => task.status === "verified" && task.assignedTo === user.email);
  const done = tasks.filter((task) => task.status === "done" && task.assignedTo === user.email);
  const inProgress = tasks.filter((task) => task.status === "inprogress" && task.assignedTo === user.email);
  const todo = tasks.filter((task) => task.status === "todo" && task.assignedTo === user.email);
  const [productivity, setProductivity] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>()


  useEffect(() => {
    dispatch(getTasks(user.role, user.email));
  }, [dispatch]);

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
    <Card className="rounded-lg shadow-lg py-10">
      <div className="font-bold pb-7 px-7 uppercase">Vos statistique</div>
      <div className="flex flex-col items-start px-7">
        <div className="grid gap-3 mt-4 ">
          <div className="p-1 mb-3 flex gap-4 items-center">
            <span className="font-black text-2xl text-blue-500">{verified.length}</span>
            <BadgeCheck size={30} className="text-blue-500 hover:text-blue-900" />
            Verified
          </div>
          <div className="p-1 mb-3 flex gap-4 items-center">
            <span className="font-black text-2xl text-blue-500">{done.length}</span>
            <CheckCircle2 size={30} className="text-blue-500 hover:text-blue-900" />
            Done
          </div>
          <div className="p-1 mb-3 flex gap-4 items-center">
            <span className="font-black text-2xl text-blue-500">{inProgress.length}</span>
            <Clock size={30} className="text-blue-500 hover:text-blue-900" />
            In Progress
          </div>
          <div className="p-1 mb-3 flex gap-4  items-center	">
            <span className="font-black text-2xl text-blue-500">{todo.length}</span>
            <CircleX size={30} className="text-blue-500 hover:text-blue-900" />
            Todo
          </div>
        </div>

        <div className="mt-5">
          <p>Productivite</p>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-lg">
          <div
            className="h-2 bg-blue-500 rounded-lg"
            style={{ width: `${productivity}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default States;
