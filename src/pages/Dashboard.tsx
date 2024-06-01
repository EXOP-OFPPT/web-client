'use client';

import BarChartComponent from '@/components/Dashboard/BarChartComponent';
import { CalendarDateRangePicker } from '@/components/Dashboard/CalendarDateRangePicker';
import PieChartComponent from '@/components/Dashboard/PieChartComponent';
import { RecentInfo } from '@/components/Dashboard/RecentInfo';
import { Resume } from '@/components/Dashboard/Resume';
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
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';




export default function Dashboard() {
  const employeesLoading = useSelector((state: RootState) => state.getEmployees.loading)
  const tasksLoading = useSelector((state: RootState) => state.getTasks.loading)
  const kpisLoading = (useSelector((state: RootState) => state.getKpis.loading))
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const getData = async () => {
      await dispatch(getTasks())
      await dispatch(getKpis())
    }
    getData()
  }, [])

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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Tasks Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/*//! Bar Chart Component */}
                    <BarChartComponent />
                  </CardContent>
                </Card>
                <Card className="col-span-8 md:col-span-4">
                  <CardHeader>
                    <CardTitle>PieChart</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/*//! Pie Chart Component */}
                    <PieChartComponent />
                  </CardContent>
                </Card>
                <Card className="col-span-7 md:col-span-4">
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    );
  }
}