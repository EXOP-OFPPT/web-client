import React from 'react';
import ApexCharts from 'apexcharts';
import { addDays, startOfYear, endOfYear, getDay, getWeek } from 'date-fns';

class HeatmapChart extends React.Component {
    chart: ApexCharts | null = null;

    getWeekNumber(date: Date) {
        return getWeek(date);
    }

    generateData(start: Date, end: Date, { min, max }: { min: number, max: number }) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const daysOfWeek: { x: string, y: number }[][] = Array.from({ length: 7 }, () => []);
        let maxWeek = 0;
        for (let day = start; day <= end; day = addDays(day, 1)) {
            const value = Math.floor(Math.random() * (max - min + 1) + min) + 1; // Add 1 to the value
            const week = this.getWeekNumber(day);
            const dayOfWeek = (getDay(day) + 6) % 7; // Adjust dayOfWeek to start from Monday
            daysOfWeek[dayOfWeek].push({ x: `${week}`, y: value });
            if (week > maxWeek) {
                maxWeek = week;
            }
        }
        console.log(maxWeek)
        return { series: daysOfWeek.map((data, i) => ({ name: days[i], data })), maxWeek };
    }

    componentDidMount() {
        const start = startOfYear(new Date());
        const end = endOfYear(new Date());
        const { series: seriesData, maxWeek } = this.generateData(start, end, { min: 0, max: 90 });

        var options = {
            series: seriesData,
            chart: {
                height: 300,
                type: 'heatmap',
                // background: '#333333'
            },
            dataLabels: {
                enabled: false
            },
            title: {
                text: 'NaN contributions in the last year'
            },
            xaxis: {
                categories: Array.from({ length: maxWeek }, (_, i) => `${i + 1}`),
            },
            yaxis: {
                categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
plotOptions: {
    heatmap: {
        shadeIntensity: 0,
        colorScale: {
            ranges: [
                { from: 0, to: 1, color: '#333333' }, // Color for cells with value 0
                { from: 2, to: 25, color: '#0e4429' },
                { from: 26, to: 50, color: '#005d02' },
                { from: 51, to: 75, color: '#008d32' },
                { from: 76, to: 100, color: '#39ff53' },
            ],
        },
        stroke: {
            width: 4, // Set the width of the border
            colors: ['#000'], // Set the color of the border to the background color
        },
    },
},
            // theme: {
            //     mode: 'dark', // or 'light'
            //     palette: 'palette1', // 'palette1' to 'palette10'
            // },
        };

        this.chart = new ApexCharts(document.querySelector("#chart"), options);
        this.chart.render();
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    render() {
        return <div id="chart" className='w-full aspect-[1/1] heatmap-chart'></div>;
    }
}

export default HeatmapChart;


// class Chart extends React.Component {
//     chart: ApexCharts | null = null;

//     componentDidMount() {
//         const options = {
//             chart: {
//                 type: 'line',
//                 height: '350',
//             },
//             series: [{
//                 name: 'sales',
//                 data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
//             }],
//             xaxis: {
//                 categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
//             }
//         };

//         this.chart = new ApexCharts(document.querySelector("#chart"), options);
//         this.chart.render();
//     }

//     componentWillUnmount() {
//         if (this.chart) {
//             this.chart.destroy();
//         }
//     }

//     render() {
//         return <div id="chart"></div>;
//     }
// }

// export default Chart;



