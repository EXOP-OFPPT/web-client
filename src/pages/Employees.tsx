import AddEmployee from "@/components/Employees/Create";
import DisplayEmployees from "@/components/Employees/Display";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { clearMessageAndError, getEmployees } from "@/state/Employees/GetSlice";
import { AppDispatch, RootState } from "@/state/store";
import { CheckCircle2, CircleX, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Employees: React.FC = () => {
  const employees = useSelector(
    (state: RootState) => state.getEmployees.employees
  );
  const isloading = useSelector(
    (state: RootState) => state.getEmployees.loading
  );
  const message = useSelector((state: RootState) => state.getEmployees.message);
  const error = useSelector((state: RootState) => state.getEmployees.error);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(getEmployees());
    }
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
      <Toaster />
      <div className="h-[calc(100vh-4rem)] flex flex-col gap-2 items-center text-center py-5">
        {/* Header */}
        <Card className="w-full xlg:w-4/5 md:w-11/12 flex justify-between items-end px-4 py-5 bg-transparent">
          <div className="flex flex-col items-start">
            <h6>Page</h6>
            <h3 className="text-4xl font-bold text-primary">Employees</h3>
          </div>
          {/* Add Employee */}
          <AddEmployee />
        </Card>

        {/* Table */}
        {isloading ? (
          <Loader2 className="h-10 w-10 mt-10 text-primary animate-spin" />
        ) : (
          <DisplayEmployees />
        )}
      </div>
    </>
  );
};

export default Employees;
