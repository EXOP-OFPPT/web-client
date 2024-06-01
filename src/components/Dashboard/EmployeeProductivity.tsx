import { EmployeeType } from "@/state/Employees/GetSlice"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

type EmployeeProductivityProps = {
    employee: EmployeeType;
}


export const EmployeeProductivity = ({ employee }: EmployeeProductivityProps) => {

    const tasks = useSelector((state: RootState) => state.getTasks.tasks);
    const verified = tasks.filter((task) => task.status === "verified" && task.assignedTo === employee.email);
    const done = tasks.filter((task) => task.status === "done" && task.assignedTo === employee.email);
    const inProgress = tasks.filter((task) => task.status === "inprogress" && task.assignedTo === employee.email);
    const todo = tasks.filter((task) => task.status === "todo" && task.assignedTo === employee.email);
    const [productivity, setProductivity] = useState<number>(0);

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
        <div className="flex justify-between items-center">
            <Avatar className="h-9 w-9">
                <AvatarImage src={employee.avatar?.photoURL} loading="lazy" className="object-cover" alt="Avatar" />
                <AvatarFallback>
                    {employee?.firstName?.charAt(0).toUpperCase()}
                    {employee?.lastName?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{employee?.firstName} {employee?.lastName}</p>
                <p className="text-sm text-muted-foreground">
                    {employee.email}
                </p>
            </div>
            {/* <div className="ml-auto font-medium">{productivity.toFixed(2)}%</div> */}
            <Card className="ml-auto sm:bl min-w-32 max-w-32  border-neutral-700">
                <div className="text-center w-full h-2 p-[1.5px]">
                    <div className="!bg-primary h-full flex justify-center items-center rounded-full" style={{ width: `${productivity}%` }}>
                    </div>
                    <span className="text-[13px]">{productivity}</span>
                </div>
            </Card>
        </div>
    )
}