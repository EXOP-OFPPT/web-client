import NavBar from "@/components/Layouts/Navbar";
import Settings from "@/components/Layouts/Settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { getEmployees } from "@/state/Employees/GetSlice";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const employees = useSelector((state: RootState) => state.getEmployees.employees);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(getEmployees());
    }
  }, [dispatch]);

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
            <div className="absolute bottom-2 right-4">
              <Settings />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RootLayout;
