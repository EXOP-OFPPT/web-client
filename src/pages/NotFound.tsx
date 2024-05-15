import React from "react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/global/mode-toggle";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="absolute right-8 top-4">
        <ModeToggle />
      </section>
      <div className="h-[100vh] w-full flex flex-col justify-center items-center gap-4 text-2xl">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Button onClick={() => navigate("/app")} className="">
          Go Dashboard
        </Button>
      </div>
    </>
  );
};

export default NotFound;
