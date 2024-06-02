'use client';

import BarChartComponent from '@/components/Charts/BarChartComponent';
import { CalendarDateRangePicker } from '@/components/Charts/CalendarDateRangePicker';
import PieChartComponent from '@/components/Charts/PieChartComponent';
import RadarChartKpiComponent from '@/components/Charts/RadarChartKpiComponent';
import RadarChartTaskComponent from '@/components/Charts/RadarChartTaskComponent';
import EmployeesContributions from '@/components/Dashboard/EmployeesContributions';
import { RecentInfo } from '@/components/Dashboard/RecentInfo';
import { Resume } from '@/components/Dashboard/Resume';
import { ThemeProviderContext } from '@/components/global/theme-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getKpis } from '@/state/Kpis/GetSlice';
import { AppDispatch, RootState } from '@/state/store';
import { getTasks } from '@/state/Tasks/GetSlice';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: "/" });

type Theme = "dark" | "light" | "system"

export default function Dashboard() {
  const user = cookies.get("user")
  const employeesLoading = useSelector((state: RootState) => state.getEmployees.loading)
  const employees = useSelector((state: RootState) => state.getEmployees.employees)
  const tasksLoading = useSelector((state: RootState) => state.getTasks.loading)
  const tasks = useSelector((state: RootState) => state.getTasks.tasks)
  const kpisLoading = (useSelector((state: RootState) => state.getKpis.loading))
  const kpis = (useSelector((state: RootState) => state.getKpis.kpis))
  const { theme } = React.useContext(ThemeProviderContext);
  const [stateTheme, setStateTheme] = React.useState<"dark" | "light">("light");
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const getData = async () => {
      await dispatch(getTasks())
      await dispatch(getKpis())
    }
    getData()
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

  if (employeesLoading || tasksLoading || kpisLoading) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <Loader2Icon className="h-10 w-10 mt-10 text-primary animate-spin" />
      </div>
    )
  } else {
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Hi, Welcome back 👋
            </h2>
            <div className="hidden items-center space-x-2 md:flex">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              {/*//! Resume Cards */}
              <Resume />
              {/* Remark about verified tasks */}
              <p className="text-sm text-gray-500">
                Note: The verified tasks are also considered as done tasks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Tasks Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChartComponent />
                  </CardContent>
                </Card>
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Radar Kpi Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <RadarChartKpiComponent kpis={kpis} theme={stateTheme} />
                  </CardContent>
                </Card>
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Radar Task Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <RadarChartTaskComponent tasks={tasks} theme={stateTheme} />
                  </CardContent>
                </Card>
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>PieChart</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2 h-auto flex flex-1 justify-center items-center">
                    <PieChartComponent />
                  </CardContent>
                </Card>
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Employees</CardTitle>
                    <CardDescription>
                      Most productive employees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentInfo />
                  </CardContent>
                </Card>
                {user?.role === 'admin' &&
                  <Card className="col-span-full">
                    <CardHeader>
                      <CardTitle>Employees Contributes</CardTitle>
                      <CardDescription>
                        The Statistiques of employees
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EmployeesContributions employees={employees} theme={stateTheme} />
                    </CardContent>
                  </Card>}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    );
  }
}