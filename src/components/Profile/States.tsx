import React from "react";
import { BadgeCheck, CircleX, Clock } from "lucide-react";
import { Card } from "../ui/card";

type StatesProps = {};

const States: React.FC<StatesProps> = () => {
  return (
    <Card className="rounded-lg shadow-lg py-10">
      <div className="font-bold pb-7 px-7 uppercase">Vos statistique</div>
      <div className="flex flex-col items-start px-7">
        <div className="grid gap-3 mt-4 ">
          <div className="p-1 mb-3 flex gap-4 items-center">
            <span className="font-black text-2xl text-blue-500">10</span>
            <BadgeCheck size={30} className="text-blue-500 hover:text-blue-900" />
            Finis
          </div>
          <div className="p-1 mb-3 flex gap-4 items-center">
            <span className="font-black text-2xl text-blue-500">10</span>
            <Clock size={30} className="text-blue-500 hover:text-blue-900" />
            En cours
          </div>
          <div className="p-1 mb-3 flex gap-4  items-center	">
            <span className="font-black text-2xl text-blue-500">10</span>
            <CircleX size={30} className="text-blue-500 hover:text-blue-900" />
            Non-Finis
          </div>
        </div>

        <div className="mt-5">
          <p>Productivite</p>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-lg">
          <div
            className="h-2 bg-blue-500 rounded-lg"
            style={{ width: ` 10%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default States;
