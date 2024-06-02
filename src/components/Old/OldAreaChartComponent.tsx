import { Component } from 'react';
import Chart from 'react-apexcharts';

type ContributionType = {
    contribute: string;
    contributedAt: string;
};

interface IProps {
    contributions: ContributionType[];
    theme: "light" | "dark";
}

interface IState {
    series: { name: string; data: number[] }[];
    options: any;
}

class AreaChart extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            series: [],
            options: this.getChartOptions(props.theme, [])
        };
    }

    componentDidMount() {
        this.updateChartData(this.props.contributions);
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.contributions !== this.props.contributions || prevProps.theme !== this.props.theme) {
            this.updateChartData(this.props.contributions);
        }
    }

    componentWillUnmount() {
        // Cleanup if needed
    }

    getChartData(contributions: ContributionType[]) {
        // Same logic as before, but moved into a separate method
        const contributionsByDay = contributions.reduce((acc, contribution) => {
            const date = new Date(contribution.contributedAt);
            date.setHours(0, 0, 0, 0); // Reset time to 00:00:00

            const contributionDay = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

            if (!acc[contributionDay]) {
                acc[contributionDay] = 0;
            }

            // Increment the count for each contribution
            acc[contributionDay] += 1;

            return acc;
        }, {} as { [key: string]: number });

        const latestContributionDate = contributions.reduce((latestDate, contribution) => {
            const contributionDate = new Date(contribution.contributedAt);
            return contributionDate > latestDate ? contributionDate : latestDate;
        }, new Date(0)); // Initialize with the earliest possible date

        latestContributionDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00

        const year = latestContributionDate.getFullYear();
        const month = latestContributionDate.getMonth() + 1; // getMonth() is zero-based

        const daysInMonth = new Date(year, month, 0).getDate();
        const categories = Array.from({ length: daysInMonth }, (_, i) => `${year}-${month.toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`);

        // Map contributions to dates
        const data = categories.map(date => contributionsByDay[date] || 0);

        return { categories, data };
    }

    getChartOptions(theme: "light" | "dark", categories: string[]) {
        // Same logic as before, but moved into a separate method
        return {
            chart: {
                height: 350,
                type: 'area',
            },
            colors: ['#22c55e'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
            },
            xaxis: {
                type: 'datetime',
                categories,
                labels: {
                    format: 'dd',
                    style: {
                        colors: theme === 'dark' ? '#FFFFFF' : '#000000', // White color for black theme, black color for white theme
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: theme === 'dark' ? '#FFFFFF' : '#000000', // White color for black theme, black color for white theme
                    },
                },
            },
            tooltip: {
                theme, // Light theme for dark background, dark theme for light background
                x: {
                    format: 'dd/MM/yyyy',
                },
            },
        };
    }

    updateChartData(contributions: ContributionType[]) {
        const { categories, data } = this.getChartData(contributions);
        const options = this.getChartOptions(this.props.theme, categories);
        this.setState({ series: [{ name: 'Contributes', data }], options });
    }

    render() {
        const { options, series } = this.state;
        return (
            <div>
                <div id="chart">
                    {
                        // @ts-ignore
                        <Chart options={options} series={series} type="area" height={350} />
                    }
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}

export default AreaChart;