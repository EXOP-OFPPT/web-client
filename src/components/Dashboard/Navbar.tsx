import { Card } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/state/store";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./UserProfile";
import { setMenu } from "@/state/NavBar/NavBarSlice";
import Notification from "./Notification";
import NavButton from "../global/NavButton";
import TooltipComponent from "../global/TooltipComponent";
import SideBar from "./SideBar";
import Cookies from "universal-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const cookies = new Cookies(null, { path: "/" });

const NavBar: React.FC = () => {
  const user = cookies.get("user");
  const menu = useSelector((state: RootState) => state.navBar.menu);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Card className="fixed flex justify-between items-center rounded-none border-l-0 h-16 px-2 w-full z-50">
      {/*//! Handle display SideBar */}
      <SideBar />
      {/*//! NavBar items */}
      <div className="h-full flex justify-center items-center gap-2">
        {/* Notification */}
        <TooltipComponent title="Notification">
          <NavButton
            title="Notification"
            dotColor="rgb(254, 201, 15)"
            customFunc={
              menu == "notification"
                ? () => dispatch(setMenu(""))
                : () => dispatch(setMenu("notification"))
            }
            icon={<Bell />}
          />
        </TooltipComponent>

        {/* Profile Trigger */}
        <TooltipComponent title="Profile">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={
              menu == "userProfile"
                ? () => dispatch(setMenu(""))
                : () => dispatch(setMenu("userProfile"))
            }
          >
            <Avatar className="w-8 h-8 flex items-center justify-center">
              <AvatarImage loading="lazy" src={user?.avatar} className="object-cover" />
              <AvatarFallback className="text-xs">
                {user?.firstName?.charAt(0).toUpperCase()}
                {user?.lastName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {user?.firstName}
              </span>
            </p>
            {menu == "userProfile" ? (
              <ChevronUp className="text-gray-400 text-14" />
            ) : (
              <ChevronDown className="text-gray-400 text-14" />
            )}
          </div>
        </TooltipComponent>
        {/* Display Menu */}
        {menu == "notification" && <Notification />}
        {menu == "userProfile" && <UserProfile />}
      </div>
    </Card>
  );
};

export default NavBar;
