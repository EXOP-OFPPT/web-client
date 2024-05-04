import { Card } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/state/store";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import userProfileImage from "/01.jpg";
import UserProfile from "./UserProfile";
import { setMenu } from "@/state/NavBar/NavBarSlice";
import Notification from "./Notification";
import NavButton from "../global/NavButton";
import TooltipComponent from "../global/TooltipComponent";
import SideBar from "./SideBar";

const NavBar: React.FC = () => {
  const menu = useSelector((state: RootState) => state.navBar.menu);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Card className="fixed flex justify-between items-center rounded-none border-l-0 h-16 px-2 w-full z-50">
      {/*//! Handle display Side Bar */}
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
            <img
              className="rounded-full w-8 h-8"
              src={userProfileImage}
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                Michael
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
