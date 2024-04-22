import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout: React.FC = () => {

  return (
    <div className="min-h-[100vh] overflow-hidden">
      <Outlet />
    </div>
  );
};

export default RootLayout;
