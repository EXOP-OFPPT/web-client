import React, { useEffect } from "react";
import { Card } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getEmployeeTasks } from "@/state/Tasks/GetSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ListTodoIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { EmployeeType } from "@/state/Employees/GetSlice";

type HistoryProps = {};

const History: React.FC<HistoryProps> = () => {
  const employee = useSelector((state: RootState) => state.getEmployees.employee) as EmployeeType;
  const userTasks = useSelector((state: RootState) => state.getTasks.tasks);
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getEmployeeTasks(employee?.email));
  }, [dispatch]);

  return (
    <Card className="rounded-lg shadow-lg py-2 mb-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="font-bold px-7 uppercase">Historique</div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-1 text-left px-1">
              {userTasks.map((task, index) => {
                let bgColor;
                if (task.status === 'todo') {
                  bgColor = 'bg-neutral-400';
                } else if (task.status === 'inprogress') {
                  bgColor = 'bg-yellow-500';
                } else if (task.status === 'done') {
                  bgColor = 'bg-primary';
                }
                return (
                  <Alert key={index}>
                    <ListTodoIcon className="h-4 w-4" />
                    <AlertTitle>{task.title}</AlertTitle>
                    <div className="flex justify-between items-center">
                      <AlertDescription className="flex gap-4">
                        <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">{task.probleme}</span>
                        <Badge variant="outline" className={`w-fit flex justify-center items-center ${bgColor} hover:${bgColor}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </AlertDescription>
                      <Badge variant="secondary">Last update: {task.updatedAt.toString().split("T")[0]}</Badge>
                    </div>
                  </Alert>
                  // <div key={task.id} className="p-1 mb-3 flex gap-4 items-center">
                  //   <span className="font-black text-blue-500">{task.title}</span>
                  //   <span className="font-black text-blue-500">{task.status}</span>
                  // </div>
                )
              })}
            </div>

          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </Card>
  );
};

export default History;
