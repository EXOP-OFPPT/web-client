import EmployeesTable from "@/components/EmployeesTable/EmployeesTable";
import { Card } from "@/components/ui/card";
import { GetEmployees } from "@/state/Employees/EmployeesSlice";
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
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(GetEmployees());
    }
  }, [dispatch]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gap-2 items-center text-center py-5">
      <Card className="w-full xlg:w-4/5 md:w-11/12 flex flex-col items-start px-4 bg-transparent">
        <h6 className="my-4">Page</h6>
        <h3 className="text-4xl font-bold mb-4 text-primary">Employees</h3>
      </Card>
      {/* {isloading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button onClick={() => dispatch(GetEmployees())}>
            Get Employees
          </Button>
        )} */}
      {isloading ? (
        <Loader2 className="h-10 w-10 mt-10 text-primary animate-spin" />
      ) : (
        <EmployeesTable />
      )}
    </div>
  );
};

export default Employees;
