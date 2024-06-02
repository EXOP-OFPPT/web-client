import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ThemeProviderContext } from '../global/theme-provider';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { mapTasksToChartData } from './ChartData';


const chartSetting = {
  yAxis: [
  ],
  height: 500,
};


type Theme = "dark" | "light" | "system"
type statusColorsType = {
  todo: string;
  inprogress: string;
  done: string;
  verified: string;
}

const valueFormatter = (value: number | null) => `${value}`;

export default function BarChartComponent() {
  const [chartSettingState, setChartSettingState] = React.useState<any>(chartSetting);
  const { theme } = React.useContext(ThemeProviderContext);
  const tasks = useSelector((state: RootState) => state.getTasks.tasks);
  // Transform tasks data into chart data
  const chartData = React.useMemo(() => mapTasksToChartData(tasks), [tasks]);

  const statusColors: statusColorsType = {
    todo: "#888",
    inprogress: "#fa2",
    done: "#16a36a",
    verified: "#0093ff",
  };

  // Convert chartData to the format that BarChart component expects
  const series = React.useMemo(() => {
    return Object.keys(chartData[0]).filter(key => key !== 'month').map(key => ({
      dataKey: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      valueFormatter,
      color: statusColors[key as keyof statusColorsType], // Add type assertion here
    }));
  }, [chartData]);


  React.useEffect(() => {
    let currentTheme: Theme = theme
    if (currentTheme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
    }
    const newChartSetting = {
      ...chartSetting,
      sx: {
        [`.MuiChartsLegend-series text tspan`]: {
          fill: currentTheme === "light" ? 'black' : 'white', // Change color of legend labels
        },
        ['.MuiChartsLegend-mark']: {
          rx: '3px',
          ry: '3px',
        },
        [`.${axisClasses.left} .${axisClasses.tickLabel}`]: {
          fill: currentTheme === "light" ? 'black' : 'white', // Change color of y-axis labels
        },
        [`.${axisClasses.left} .${axisClasses.line}`]: {
          stroke: currentTheme === "light" ? 'black' : 'white', // Change color of y-axis line
        },
        [`.${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
          fill: currentTheme === "light" ? 'black' : 'white', // Change color of x-axis labels
        },
        [`.${axisClasses.bottom} .${axisClasses.line}`]: {
          stroke: currentTheme === "light" ? 'black' : 'white', // Change color of x-axis line
        },
      },
    }
    setChartSettingState({ ...newChartSetting });
  }, [theme])


  return (
    <BarChart
      dataset={chartData}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      borderRadius={3}
      series={series}
      {...chartSettingState}
      slotProps={{
        // Custom loading message
        loadingOverlay: { message: 'Data should be available soon.' },
        // Custom message for empty chart
        noDataOverlay: { message: 'Select some data to display.' },
      }}
    />
  );
}
