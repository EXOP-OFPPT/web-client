import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import AreaChart from "../Dashboard/AreaChart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import Cookies from "universal-cookie";
import { getEmployeeContributions } from "@/state/Employees/GetSlice";
import { ThemeProviderContext } from "../global/theme-provider";
const cookies = new Cookies(null, { path: "/" });

type ChartsProps = {};
type Theme = "dark" | "light" | "system"


const Charts: React.FC<ChartsProps> = () => {
  const user = cookies.get("user");
  const employeeContributes = useSelector((state: RootState) => state.getEmployees.employeeContributions)
  const loading = useSelector((state: RootState) => state.getEmployees.loading)
  const { theme } = React.useContext(ThemeProviderContext);
  const [stateTheme, setStateTheme] = React.useState<"dark" | "light">("light");
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getEmployeeContributions(user.email))
  }, [])

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


  if (!loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle> Vos statistique</CardTitle>
        </CardHeader>
        <CardContent className="!p-0">
          <AreaChart contributions={employeeContributes} theme={stateTheme} />
        </CardContent>
      </Card>
    );
  }
};

export default Charts;


