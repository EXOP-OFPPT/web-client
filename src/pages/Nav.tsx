import { ModeToggle } from "@/components/mode-toggle";
import { Card } from "@/components/ui/card";
import { setIsActive } from "@/state/SideBar/SideBarSlice";
import { AppDispatch, RootState } from "@/state/store";
import { Bell, ChevronDown, ChevronUp, PanelLeftOpen } from "lucide-react";
import React, { useEffect } from "react";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import userProfileImage from "/EXOP.jpg";
import UserProfile from "./UserProfile";
import { setMenu } from "@/state/NavBar/NavBarSlice";
import Notification from "./Notification";
import NavButton from "./NavButton";

const Nav: React.FC = () => {
  const menu = useSelector((state: RootState) => state.navBar.menu);
  const isActive = useSelector((state: RootState) => state.sideBar.isActive);
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   const handleResize = debounce(() => {
  //     if (window.innerWidth <= 900 && isActive) {
  //       dispatch(setIsActive(false));
  //     } else if (window.innerWidth > 900 && !isActive) {
  //       dispatch(setIsActive(true));
  //     }
  //   }, 80); // delay in milliseconds

  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // }, [isActive, dispatch]);

  return (
    <Card
      className="fixed flex justify-end items-center rounded-none border-l-0 h-16 w-full
    "
    >
      {/*//! Handle display Side Bar */}
      <div>
        {!isActive && (
          <Card className="absolute left-3 top-4 p-1 mr-2 text-white flex justify-center items-center">
            <button
              type="button"
              onClick={() => dispatch(setIsActive(true))}
              className="hover:bg-light-gray"
            >
              <PanelLeftOpen className="text-neutral-500" />
            </button>
          </Card>
        )}
      </div>
      {/*//! NavBar items */}
      <div
        className={`absolute h-full mr-2 flex justify-center items-center gap-2 ${
          isActive ? "right-72" : "right-0"
        }`}
      >
        {/* Notification */}
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
        {/* Profile Trigger */}
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
        {/* Mode Toggle */}
        <ModeToggle />
        {/* Display Menu */}
        {menu == "notification" && <Notification />}
        {menu == "userProfile" && <UserProfile />}
      </div>
    </Card>
  );
};

export default Nav;
