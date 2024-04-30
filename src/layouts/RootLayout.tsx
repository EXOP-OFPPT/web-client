import NavBar from "@/components/Dashboard/Navbar";
import Sidebar from "@/components/Dashboard/Sidebar";
import Settings from "@/components/Dashboard/Settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const isActive = useSelector((state: RootState) => state.sideBar.isActive);
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const { toast } = useToast();

  useEffect(() => {
    if (isLogin) {
      toast({
        variant: "default",
        title: "Action dispatched",
        description: "User logged in successfully!",
        style: {
          backgroundColor: "#4caf50",
        },
      });
    }
  }, [isLogin]);

  return (
    <>
      <Toaster />
      <div className="min-h-[100vh] w-full overflow-hidden">
        <div className="flex">
          {/*//! Display Sidebar */}
          {isActive && <Sidebar />}

          <div className="flex-1">
            {/*//! Display Nav */}
            <NavBar />
            {/*//! Display Children */}
            <ScrollArea className="h-[calc(100vh-4rem)] mt-[4rem]">
              {children}
            </ScrollArea>
            {/*//! Settings Toggle */}
            <div className="absolute bottom-4 right-5">
              <Settings />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RootLayout;
