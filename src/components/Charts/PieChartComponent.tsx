import { RootState } from '@/state/store';
import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from 'react-redux';

type CounterIndexType = 'C' | 'D' | 'E';

export default function PieChartComponent() {
    const kpis = useSelector((state: RootState) => state.getKpis.kpis); // lists of kpis

    const counts = { C: 0, D: 0, E: 0 };

    kpis.forEach((kpi) => {
        let value;
        if (kpi.currentTaux < kpi.minTaux && kpi.type == "eliminated") {
            value = "E";
        } else if (kpi.currentTaux < kpi.minTaux && kpi.type == "normal") {
            value = "D";
        } else if (kpi.currentTaux >= kpi.minTaux) {
            value = "C";
        }
        counts[value as CounterIndexType]++;
    });

    const total = kpis.length;
    const data = [
        { id: 0, value: Number(((counts.C / total) * 100).toFixed(2)), label: 'State C', color: "#16a34a" },
        { id: 1, value: Number(((counts.D / total) * 100).toFixed(2)), label: 'State D', color: "#737373" },
        { id: 2, value: Number(((counts.E / total) * 100).toFixed(2)), label: 'State E', color: "#ff4d4f" },
    ];

    return (
        <PieChart
            series={[
                {
                    data,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    innerRadius: 30,
                    outerRadius: 120,
                    paddingAngle: 2,
                    cornerRadius: 5,
                },
            ]}
            height={250}
        />
    );
}