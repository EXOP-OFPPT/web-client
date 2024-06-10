import { db } from '@/firebase/firebase';
import { EmployeeType } from '@/state/Employees/GetSlice';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

type ContributionType = {
    contribute: string;
    contributedAt: string;
};

interface IProps {
    employee: EmployeeType;
    theme: "light" | "dark";
}

const AreaChartComponent = ({ employee, theme }: IProps) => {
    const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
    const [employeeContributions, setEmployeeContributions] = useState<ContributionType[]>([]);

useEffect(() => {
  const fetchEmployeeContributions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees", employee.email, "contributions"));
      const contributions: ContributionType[] = [];
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0); // Reset time to 00:00:00
      querySnapshot.forEach((doc) => {
        const contribution = doc.data() as ContributionType;
        const contributedAt = new Date(contribution.contributedAt);
        if (contributedAt >= firstDayOfMonth) {
          contributions.push(contribution);
        }
      });
      setEmployeeContributions(contributions);
    } catch (error: any) {
      console.log({ code: error.code, message: error.message });
    }
  };

  fetchEmployeeContributions();
}, [employee.email]);

    useEffect(() => {
        updateChartData(employeeContributions);
    }, [employeeContributions, theme]);

    const getChartData = (contributions: ContributionType[]) => {
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

        const date = new Date();
        date.setHours(0, 0, 0, 0); // Reset time to 00:00:00

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() is zero-based

        const daysInMonth = new Date(year, month, 0).getDate();
        const categories = Array.from({ length: daysInMonth }, (_, i) => `${year}-${month.toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`);

        // Map contributions to dates
        const data = categories.map(date => contributionsByDay[date] || 0);

        return { categories, data };
    };

    const getChartOptions = (theme: "light" | "dark", categories: string[]) => {
        // Same logic as before, but moved into a separate function
        return {
            chart: {
                height: 350,
                type: 'area',
            },
            colors: ['#22c55e'],
            dataLabels: {
                enabled: false,
            },
            title: {
                text: `${employee.firstName} ${employee.lastName} Contributions`,
                align: 'left',
                style: {
                    color: theme === 'dark' ? '#eee' : '#000000',
                },
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
    };

    const updateChartData = (contributions: ContributionType[]) => {
        const { categories, data } = getChartData(contributions);
        const options = getChartOptions(theme, categories);
        setSeries([{ name: 'Contributes', data }]);
        setOptions(options);
    };

    const [options, setOptions] = useState<any>(getChartOptions(theme, []));


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
};

export default AreaChartComponent;




