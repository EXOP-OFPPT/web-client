import { ModeToggle } from "@/components/global/mode-toggle";
import ThemeSwitcher from "@/components/global/ThemeSwitcher";
import TooltipComponent from "@/components/global/Tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { setHandlePickedTheme } from "@/state/NavBar/NavBarSlice";
import { AppDispatch, RootState } from "@/state/store";
import { Check, SettingsIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const Settings = () => {
  const pickedTheme = useSelector(
    (state: RootState) => state.navBar.pickedTheme
  );
  const dispatch = useDispatch<AppDispatch>();

  const themeColors = [
    {
      name: "zinc-theme",
      color: "hsl(240 3.7% 15.9%)",
    },
    {
      name: "rose-theme",
      color: "hsl(346.8 77.2% 49.8%)",
    },
    {
      name: "blue-theme",
      color: "hsl(221.2 83.2% 53.3%)",
    },
    {
      name: "green-theme",
      color: "hsl(142.1 76.2% 36.3%)",
    },
    {
      name: "orange-theme",
      color: "hsl(24.6 95% 53.1%)",
    },
  ];

  return (
    <Sheet>
      {/* <TooltipComponent title="Settings"> */}
      <SheetTrigger>
        <Card className="p-2 rounded-full text-primary border-2 border-primary">
          <SettingsIcon />
        </Card>
      </SheetTrigger>
      {/* </TooltipComponent> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          {/* Mode Toggle */}
          <ModeToggle />
          <div className="flex gap-2">
            {themeColors.map((theme, index) => (
              <button
                key={index}
                style={{ backgroundColor: theme.color }}
                className="rounded-full w-10 h-10 flex justify-center items-center text-white"
                onClick={() => dispatch(setHandlePickedTheme(theme.name))}
              >
                {pickedTheme == theme.name && <Check />}
              </button>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Settings;
