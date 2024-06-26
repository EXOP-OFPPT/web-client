import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ThemeProviderContext } from "../global/theme-provider";
import { EmployeeType } from "@/state/Employees/GetSlice";
import AreaChartComponent from "../Charts/AreaChartComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

type ChartsProps = {};
type Theme = "dark" | "light" | "system"


const Charts: React.FC<ChartsProps> = () => {
  const employee = useSelector((state: RootState) => state.getEmployees.employee) as EmployeeType;
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
        <CardTitle> Your statistique</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <AreaChartComponent employee={employee} theme={stateTheme} />
      </CardContent>
    </Card>
  );
};

export default Charts;


