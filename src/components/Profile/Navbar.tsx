import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "../global/mode-toggle";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { EmployeeType } from "@/state/Employees/GetSlice";


type NavBarProps = {};

const Navbar: React.FC<NavBarProps> = () => {
  const employee = useSelector((state: RootState) => state.getEmployees.employee) as EmployeeType;
  const navigate = useNavigate();

  return (
    <Card className="w-full xlg:w-4/5 md:w-11/12 flex justify-between items-end px-4 py-5 bg-transparent">
      <div className="flex flex-col gap-2 items-start">
        <Badge
          onClick={() => navigate("/app")}
          variant="secondary"
          className="flex gap-2 justify-center items-center cursor-pointer"
        >
          <ArrowLeft size={25} />
          <h6>Dashboard</h6>
        </Badge>
        <h3 className="text-4xl font-bold text-primary">
          {employee?.firstName} {employee?.lastName}
        </h3>
      </div>
      <section className="relative right-30 bottom-10 z-50">
        <ModeToggle />
      </section>
    </Card>
  );
};

export default Navbar;
