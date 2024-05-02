import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type NavBarProps = {};

const Navbar: React.FC<NavBarProps> = () => {
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
        <h3 className="text-4xl font-bold text-primary">No3man R8den</h3>
      </div>
    </Card>
  );
};

export default Navbar;
