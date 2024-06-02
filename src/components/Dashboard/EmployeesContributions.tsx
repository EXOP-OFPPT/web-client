import { EmployeeType } from "@/state/Employees/GetSlice";
import AreaChartComponent from "../Charts/AreaChartComponent";

type EmployeesContributionsProps = {
    employees: EmployeeType[];
    theme: "dark" | "light";
};

const EmployeesContributions: React.FC<EmployeesContributionsProps> = ({ employees, theme }) => {
    return (
        <>
            {
                employees.map((employee, index) => (
                    <AreaChartComponent key={index} employee={employee} theme={theme} />
                ))
            }
        </>
    );
}

export default EmployeesContributions;