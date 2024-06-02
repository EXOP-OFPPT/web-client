import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Cookies from "universal-cookie";
import { ThemeProviderContext } from "../global/theme-provider";
import { EmployeeType } from "@/state/Employees/GetSlice";
import AreaChartComponent from "../Charts/AreaChartComponent";
const cookies = new Cookies(null, { path: "/" });

type ChartsProps = {};
type Theme = "dark" | "light" | "system"


const Charts: React.FC<ChartsProps> = () => {
  const user = cookies.get("user");
  const { theme } = React.useContext(ThemeProviderContext);
  const [stateTheme, setStateTheme] = React.useState<"dark" | "light">("light");

  useEffect(() => {
    let currentTheme: Theme = theme
    if (currentTheme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
    }
    setStateTheme(currentTheme)
  }, [theme])


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle> Vos statistique</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <AreaChartComponent employee={user as EmployeeType} theme={stateTheme} />
      </CardContent>
    </Card>
  );
};

export default Charts;


