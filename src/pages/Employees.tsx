import AddEmployee from "@/components/Employees/Create";
import DisplayEmployeesCards from "@/components/Employees/Display";
import DisplayEmployeesTable from "@/components/Employees/Table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserInterface } from "@/state/Auth/AuthSlice";
import { clearMessageAndError, getEmployees } from "@/state/Employees/GetSlice";
import { AppDispatch, RootState } from "@/state/store";
import { CheckCircle2, CircleX, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type ViewType = "table" | "cards";

const Employees: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as UserInterface;
  const [view, setView] = useState<ViewType>("table");
  const isloading = useSelector(
    (state: RootState) => state.getEmployees.loading
  );
  const message = useSelector((state: RootState) => state.getEmployees.message);
  const error = useSelector((state: RootState) => state.getEmployees.error);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();


  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast({
        variant: "default",
        title: "Action dispatched",
        description: message,
        className: "text-primary border-2 border-primary text-start",
        icon: <CheckCircle2 size={40} className="mr-2" />,
      });
      dispatch(clearMessageAndError());
    } else if (error) {
      toast({
        variant: "default",
        title: "Action Failed",
        description: error?.message,
        className: "text-error border-2 border-error text-start",
        icon: <CircleX size={40} className="mr-2" />,
      });
      dispatch(clearMessageAndError());
    }
  }, [message, error]);

  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex flex-col gap-2 items-center py-5">
        {/* Header */}
        <Card className="w-full xlg:w-4/5 md:w-11/12 flex justify-between items-end px-4 py-5 bg-transparent">
          <div className="flex flex-col items-start">
            <h6>Page</h6>
            <h3 className="text-4xl font-bold text-primary">Employees</h3>
          </div>
          <div className="h-full flex flex-col justify-center gap-2">
            {/* Add Employee */}
            <Button
              className="flex justify-center items-center gap-2"
              variant="secondary"
              onClick={() =>
                setView((prev) => (prev == "table" ? "cards" : "table"))
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              View
            </Button>
            {user?.role === "admin" && <AddEmployee />}
          </div>
        </Card>

        {/* Table */}
        {isloading ? (
          <Loader2 className="h-10 w-10 mt-10 text-primary animate-spin" />
        ) : (
          <>
            {view == "table" ? (
              <DisplayEmployeesTable />
            ) : (
              <DisplayEmployeesCards />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Employees;
