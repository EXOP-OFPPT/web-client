import Navbar from "@/components/Profile/Navbar";
import AvatarComponent from "@/components/Profile/Avatar";
import Details from "@/components/Profile/Details";
import States from "@/components/Profile/States";
import Charts from "@/components/Profile/Charts";
import History from "@/components/Profile/History";
import { ScrollArea } from "@/components/ui/scroll-area";
import Actions from "@/components/Profile/Actions";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { EmployeeType, getEmployeeByEmail } from "@/state/Employees/GetSlice";
import { UserInterface } from "@/state/Auth/AuthSlice";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user) as UserInterface;
  const employee = useSelector((state: RootState) => state.getEmployees.employee) as EmployeeType;
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { email } = location.state;

  useEffect(() => {
    dispatch(getEmployeeByEmail(email));
  }, [email]);

  if (!employee || !employee.email) return null
  else {
    return (
      <>
        <ScrollArea className="h-screen w-full rounded-md border p-4 flex">
          <div className="w-full flex flex-col justify-center items-center gap-5 text-center py-5">
            <Navbar />
            <div className="w-full xlg:w-4/5 md:w-11/12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AvatarComponent />
              <Details />
              <States />
            </div>
          </div>
          <History />
          <Charts />
          {
            employee.email === user.email &&
            <Actions />
          }
        </ScrollArea>
      </>
    );
  };
}

export default Profile;
