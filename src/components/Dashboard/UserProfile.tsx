import CustomButton from "@/components/global/CustomButton";
import {
  BookCheck,
  CircleUserRound,
  CircleX,
  Inbox,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { setMenu } from "@/state/NavBar/NavBarSlice";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/state/Authe/AuthSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

const UserProfile: React.FC = () => {
  const user = cookies.get("user");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const userProfileData = [
    {
      icon: <CircleUserRound />,
      title: "My Profile",
      desc: "Account Settings",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      path: "/profile",
    },
    {
      icon: <Inbox />,
      title: "My Inbox",
      desc: "Messages & Emails",
      iconColor: "rgb(0, 194, 146)",
      iconBg: "rgb(235, 250, 242)",
      path: "/app/inbox",
    },
    {
      icon: <BookCheck />,
      title: "My Tasks",
      desc: "To-do and Daily Tasks",
      iconBg: "rgb(255, 244, 229)",
      iconColor: "rgb(254, 201, 15)",
      path: "/app/tasks",
    },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(setMenu(""));
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handleNavigateButton = (path: string) => {
    navigate(path);
    dispatch(setMenu(""));
  };


  return (
    <Card className="nav-item absolute right-1 top-16 bgg-white darkk:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <CustomButton
          onClick={() => dispatch(setMenu(""))}
          icon={<CircleX />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <Avatar className="h-24 w-24 flex items-center justify-center">
          <AvatarImage loading="lazy" src={user?.avatar} className="object-cover" />
          <AvatarFallback className="text-4xl">
            {user?.firstName?.charAt(0).toUpperCase()}
            {user?.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {user?.role}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {user?.email}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 border-b-1 border-color rounded-md p-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => handleNavigateButton(item.path)}
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {" "}
                {item.desc}{" "}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center items-center">
        {/* Logout */}
        <Button
          onClick={handleLogout}
          className="w-11/12 rounded-md bg-red-500 hover:bg-red-600 text-white flex justify-center items-center gap-4 "
        >
          <LogOut />
          <span>Logout</span>
        </Button>
      </div>
    </Card>
  );
};

export default UserProfile;
