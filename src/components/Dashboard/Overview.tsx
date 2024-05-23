import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { mapTasksToChartData } from './ChartData';
import { Card } from '../ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { Badge } from '../ui/badge';



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
              <Card style={{ padding: '10px' }}>
                <p><strong>{label}</strong></p>
                {payload.map((item, index) => (
                  <div className='flex justify-center items-center gap-4' key={index} style={{ color: item.color }}>
                    <Badge variant="outline" className={`w-full`} style={{ border: `2px solid ${item.color}` }}>
                      {item.name}
                    </Badge>
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