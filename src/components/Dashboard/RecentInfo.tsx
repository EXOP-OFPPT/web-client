import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { EmployeeProductivity } from './EmployeeProductivity';

export function RecentInfo() {

    const employees = useSelector((state: RootState) => state.getEmployees.employees)

    if (!(employees.length === 0)) {
        return (
            <div className="space-y-8">
                {
                    employees.map((employee, index) =>
                        <EmployeeProductivity key={index} employee={employee} />
                    )
                }
            </div>
        );
    }
}