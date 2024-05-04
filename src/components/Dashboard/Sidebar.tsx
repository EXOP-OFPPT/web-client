import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CircleUserRound,
  LineChart,
  PanelLeftOpen,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import EXOP from "../../../public/EXOP-Make-crop.png";

const SideBar = () => {
  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-red bg-primary";
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
          path: "employees",
          icon: <CircleUserRound className="scale-75" />,
        },
      ],
    },
  ];

  return (
    <Sheet>
      {/* <TooltipComponent title="Nav"> */}
      <SheetTrigger>
        <Card className="p-1 mr-2 flex justify-center items-center">
          {/* <TooltipComponent title="Menu"> */}
          <div>
            <PanelLeftOpen className="text-neutral-500" />
          </div>
          {/* </TooltipComponent> */}
        </Card>
      </SheetTrigger>
      {/* </TooltipComponent> */}
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between items-center">
              <Link
                to="/app"
                className="items-center gap-3 ml-3 mt-2 flex text-xl font-extrabold tracking-tight dark:text-white"
              >
                <img src={EXOP} alt="EXOP Logo" className="w-24 ml-3" />
              </Link>
            </div>
          </SheetTitle>

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
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SideBar;
