import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { EmployeeProductivity } from './EmployeeProductivity';
import React, { useMemo } from 'react';

export function RecentInfo() {

    const tasks = useSelector((state: RootState) => state.getTasks.tasks);
    const employees = useSelector((state: RootState) => state.getEmployees.employees);

    const employeesWithProductivity = useMemo(() => {
        return employees.map(employee => {
            let verified = 0, done = 0, inProgress = 0, todo = 0;

            tasks.forEach(task => {
                if (task.assignedTo === employee.email) {
                    switch (task.status) {
                        case "verified":
                            verified++;
                            break;
                        case "done":
                            done++;
                            break;
                        case "inprogress":
                            inProgress++;
                            break;
                        case "todo":
                            todo++;
                            break;
                        default:
                            break;
                    }
                }
            });

            let productivity = 0;
            if (tasks.length > 0) {
                productivity = (
                    (verified * 1.0 +
                        done * 0.75 +
                        inProgress * 0.5 +
                        todo * 0.0) /
                    (tasks.length * 1.0)
                ) * 100;
            }

            return { ...employee, productivity };
        }).sort((a, b) => b.productivity - a.productivity); // Sort employees by productivity
    }, [employees, tasks]);

    if (!(employees.length === 0)) {
        return (
            <div className="space-y-8">
                {
                    employeesWithProductivity.map((employee, index) =>
                        <MemoizedEmployeeProductivity key={index} employee={employee} />
                    )
                }
            </div>
        );
    }
}

const MemoizedEmployeeProductivity = React.memo(EmployeeProductivity);