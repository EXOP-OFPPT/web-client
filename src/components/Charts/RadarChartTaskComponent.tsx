import { TaskType } from '@/state/Tasks/GetSlice';
import { Component } from 'react';
import Chart from 'react-apexcharts';

interface IProps {
    tasks: TaskType[];
    theme: "light" | "dark";
}

interface IState {
    series: { name: string; data: number[] }[];
    options: any;
}

class RadarChartTaskComponent extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const todoTasks = props.tasks.filter(task => task.status === 'todo').length;
        const inProgressTasks = props.tasks.filter(task => task.status === 'inprogress').length;
        const doneTasks = props.tasks.filter(task => ['done', 'verified'].includes(task.status)).length; const verifiedTasks = props.tasks.filter(task => task.status === 'verified').length;

        const data = [todoTasks, inProgressTasks, doneTasks, verifiedTasks];
        const max = Math.max(...data);

        this.state = {
            series: [{
                name: 'Tasks',
                data,
            }],
            options: this.getOptions(['Todo', 'Inprogress', 'Done', 'Verified'], max, props.theme)
        };
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.tasks !== this.props.tasks || prevProps.theme !== this.props.theme) {
            const todoTasks = this.props.tasks.filter(task => task.status === 'todo').length;
            const inProgressTasks = this.props.tasks.filter(task => task.status === 'inprogress').length;
            const doneTasks = this.props.tasks.filter(task => ['done', 'verified'].includes(task.status)).length; const verifiedTasks = this.props.tasks.filter(task => task.status === 'verified').length;

            const data = [todoTasks, inProgressTasks, doneTasks, verifiedTasks];
            const max = Math.max(...data);

            this.setState({
                series: [{ name: 'Tasks', data }],
                options: this.getOptions(['Todo', 'Inprogress', 'Done', 'Verified'], max, this.props.theme)
            });
        }
    }

    getOptions(categories: string[], max: number, theme: "light" | "dark") {
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
                max,
                stepSize: 1,
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
            colors: ['#FF4560'],
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

export default RadarChartTaskComponent;