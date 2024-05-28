interface ChartOptions {
    series: number[];
    colors: string[];
    chart: {
        height: number;
        width: string;
        type: string;
    };
    stroke: {
        colors: string[];
        lineCap: string;
    };
    plotOptions: {
        pie: {
            labels: {
                show: boolean;
            };
            size: string;
            dataLabels: {
                offset: number;
            };
        };
    };
    labels: string[];
    dataLabels: {
        enabled: boolean;
        style: {
            fontFamily: string;
        };
    };
    legend: {
        position: string;
        fontFamily: string;
    };
    yaxis: {
        labels: {
            formatter: (value: number) => string;
        };
    };
    xaxis: {
        labels: {
            formatter: (value: number) => string;
        };
        axisTicks: {
            show: boolean;
        };
        axisBorder: {
            show: boolean;
        };
    };
}

const getChartOptions = (): ChartOptions => {
    return {
        series: [52.8, 26.8, 20.4],
        colors: ["#1C64F2", "#16BDCA", "#9061F9"],
        chart: {
            height: 420,
            width: "100%",
            type: "pie",
        },
        stroke: {
            colors: ["white"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                labels: {
                    show: true,
                },
                size: "100%",
                dataLabels: {
                    offset: -25,
                },
            },
        },
        labels: ["Direct", "Organic search", "Referrals"],
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
        },
        yaxis: {
            labels: {
                formatter: (value) => {
                    return value + "%";
                },
            },
        },
        xaxis: {
            labels: {
                formatter: (value) => {
                    return value + "%";
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    };
};

// if (document.getElementById("pie-chart") && typeof ApexCharts !== "undefined") {
//     const chart = new ApexCharts(
//         document.getElementById("pie-chart"),
//         getChartOptions()
//     );
//     chart.render();
// }