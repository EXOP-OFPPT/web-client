import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card } from "../ui/card";

type AvatarType = {
    photoURL: string;
    photoName: string;
}
type EmployeeType = {
    matricule: number | string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: string;
    photoURL?: string;
    avatar?: AvatarType;
    productivity: number
};
type EmployeeProductivityProps = {
    employee: EmployeeType;
}


export const EmployeeProductivity = ({ employee }: EmployeeProductivityProps) => {

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
                    <div className="!bg-primary h-full flex justify-center items-center rounded-full" style={{ width: `${employee?.productivity}%` }}>
                    </div>
                    <span className="text-[13px]">{employee?.productivity.toFixed(2)}</span>
                </div>
            </Card>
        </div>
    )
}