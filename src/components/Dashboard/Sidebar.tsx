import { Link, NavLink } from "react-router-dom";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import {
  CircleUserRound,
  LineChart,
  PanelLeftClose,
} from "lucide-react";
import { Card } from "../ui/card";
import { setIsActive } from "@/state/SideBar/SideBarSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import EXOP from "../../../public/EXOP-Make-crop.png";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-red";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800";

  const links = [
    {
      title: "Dashboard",
      links: [
        {
          path: "statistics",
          icon: <LineChart className="scale-75" />,
        },
        {
          path: "employee",
          icon: <CircleUserRound className="scale-75" />,
        },
      ],
    },
  ];

  return (
    <>
      {/* {activeMenu && ( */}
      <Card className="h-screen w-72 text-red rounded-none md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
        <div className="flex justify-between items-center">
          <Link
            to="/app"
            className="items-center gap-3 ml-3 mt-2 flex text-xl font-extrabold tracking-tight dark:text-white"
          >
            <img src={EXOP} alt="EXOP Logo" className="w-24 ml-3" />
          </Link>
          <TooltipComponent content="Menu" position="BottomCenter">
            <Card className="p-1 mr-2 flex justify-center items-center">
              <button
                type="button"
                onClick={() => dispatch(setIsActive(false))}
                className="hover:bg-light-gray"
              >
                <PanelLeftClose className="text-neutral-500" />
              </button>
            </Card>
          </TooltipComponent>
        </div>
        <div className="mt-10 ">
          {links.map((item, index) => (
            <div key={index}>
              <p className="text-gray-400 dark:text-gray-400 m-4 mt-4 uppercase">
                {item.title}
              </p>
              {item.links.map((link, index) => (
                <Card key={index} className="my-2 mx-4">
                  <NavLink
                    to={`${link.path}`}
                    // className="flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg"
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "hsl(142.1 76.2% 36.3%)" : "",
                      color: isActive ? "white" : "",
                    })}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize ">{link.path}</span>
                  </NavLink>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </Card>
      {/* )} */}
    </>
  );
};

export default Sidebar;
