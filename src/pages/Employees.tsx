import AddEmployee from "@/components/Employees/AddEmployee";
import EmployeesTable from "@/components/Employees/EmployeesTable";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { getEmployees } from "@/state/Employees/EmployeesSlice";
import { AppDispatch, RootState } from "@/state/store";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Employees: React.FC = () => {
  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );
  const isloading = useSelector(
    (state: RootState) => state.employees.isLoading
  );
  const message = useSelector((state: RootState) => state.employees.message);
  const error = useSelector((state: RootState) => state.employees.error);
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
        style: {
          backgroundColor: "#4caf50",
          border: "2px solid #4caf50",
          // color: "#4caf50",
        },
      });
    } else if (error) {
      toast({
        variant: "default",
        title: "Action Failed",
        description: error?.message,
        style: {
          backgroundColor: "#ff4d4f",
          border: "2px solid #ff4d4f",
          // color: "#ff4d4f",
        },
      });
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
          <EmployeesTable />
        )}
      </div>
    </>
  );
};

export default Employees;
