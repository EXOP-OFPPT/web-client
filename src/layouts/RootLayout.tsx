import NavBar from "@/components/Dashboard/Navbar";
import Settings from "@/components/Dashboard/Settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { CheckCircle2 } from "lucide-react";
import { clearMessageAndError } from "@/state/auth/AuthSlice";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const message = useSelector((state: RootState) => state.auth.message);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (isLogin && message) {
      toast({
        variant: "default",
        title: "Action dispatched",
        description: message,
        className: "text-primary border-2 border-primary text-start",
        icon: <CheckCircle2 size={40} className="mr-2" />,
      });
      dispatch(clearMessageAndError());
    }
  }, [isLogin, message]);

  return (
    <>
      <Toaster />
      <div className="min-h-[100vh] w-full overflow-hidden">
        <div className="flex">
          {/*//! Display Sidebar */}
          {/* {isActive && <Sidebar />} */}

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
