import { Component } from 'react';
import Chart from 'react-apexcharts';

type KpiType = {
    code: string;
    title: string;
    description: string;
    minTaux: number;
    currentTaux: number;
    type: string;
};

interface IProps {
    kpis: KpiType[];
    theme: "light" | "dark";
}

interface IState {
    series: { name: string; data: number[] }[];
    options: any;
}

class RadarChartKpiComponent extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const categories = props.kpis.map(kpi => kpi.title);
        const data = props.kpis.map(kpi => kpi.currentTaux);

        this.state = {
            series: [{
                name: 'Score',
                data,
            }],
            options: this.getOptions(categories, props.theme)
        };
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.kpis !== this.props.kpis || prevProps.theme !== this.props.theme) {
            const categories = this.props.kpis.map(kpi => kpi.title);
            const data = this.props.kpis.map(kpi => kpi.currentTaux);
            this.setState({
                series: [{ name: 'Score', data }],
                options: this.getOptions(categories, this.props.theme)
            });
        }
    }

    getOptions(categories: string[], theme: "light" | "dark") {
        return {
            chart: {
                height: 350,
                type: 'radar',
                toolbar: {
                    tools: {
                        download: false, // hide download button
                    },
                },
            },
            yaxis: {
                stepSize: 20,
                labels: {
                    style: {
                        colors: theme == 'dark' ? '#fff' : '#000',
                    },
                },
            },
            xaxis: {
                categories,
                labels: {
                    style: {
                        colors: theme == 'dark' ? '#fff' : '#000',
                    },
                },
            },
            tooltip: {
                theme: theme,
            },
        };
    }

    render() {
        const { options, series } = this.state;
        return (
            <div id="radarChart">
                {
                    // @ts-ignore
                    <Chart options={options} series={series} type="radar" height={350} />
                }
            </div>
        );
    }
}

export default RadarChartKpiComponent;