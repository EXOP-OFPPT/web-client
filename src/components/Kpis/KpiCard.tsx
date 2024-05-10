import { KpiType } from "@/state/Kpis/GetSlice";
import { Card } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Update from "./Update";
import Delete from "./Delete";
import Cookies from "universal-cookie";
import { Button } from "../ui/button";
const cookies = new Cookies(null, { path: "/" });

type KpiCardProps = {
  data: KpiType;
};


const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
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
            <Delete mode={"ghost"} docId={data.code} />
            {/* </TooltipComponent> */}
          </>
        }
      </div>
      <Separator orientation="horizontal" />

      <div className="p-4 flex flex-col items-center">
        <div className="text-center">
          <h2 className="text-xl font-bold capitalize ">
            {data.title}
          </h2>
          <Badge
            variant={data.value == "E" ? "destructive" : "default"}
            className="capitalize"
          >
            {data.value}
          </Badge>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <h2 className="text-xl font-bold capitalize ">
              {data.description}
            </h2>
            <Button onClick={() => console.log(data.code)}>
              Improve
            </Button>
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

export default KpiCard;
