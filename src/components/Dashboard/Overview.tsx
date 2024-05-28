import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { mapTasksToChartData } from './ChartData';
import { Card } from '../ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';



export function Overview() {
  const tasks = useSelector((state: RootState) => state.getTasks.tasks);
  const chartData = mapTasksToChartData(tasks);
  const chartDataArray = Object.values(chartData);

  return (
    <ResponsiveContainer width="100%" height={550}>
      <BarChart data={chartDataArray}>
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis />
        <Tooltip content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <Card className='w-40'>
                <div className="h-7 flex items-center px-2 flex-1 !rounded-sm rounded-bl-none !rounded-br-none">
                  <p className="text-sm font-medium leading-none">
                    {label}
                  </p>
                </div>
                {payload.map((item, index) => (
                  <div className='bg-secondary flex items-center gap-4 px-4 py-1' key={index} style={{ color: item.color }}>
                    <span className="flex h-2 w-2 translate-y-1 rounded-full" style={{ background: `${item.color}` }} />
                    <span>{item.name}</span>
                    <span>
                      {item.value}
                    </span>
                  </div>
                ))}
              </Card>
            );
          }

          return null;
        }} />
        <Bar dataKey="todo" fill="#888" radius={[2, 2, 0, 0]} />
        <Bar dataKey="inprogress" fill="#fe2" radius={[2, 2, 0, 0]} />
        <Bar dataKey="done" fill="#16a34a" radius={[2, 2, 0, 0]} />
        <Bar dataKey="verified" fill="#2563eb" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}