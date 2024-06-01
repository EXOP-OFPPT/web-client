import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { ResumeCard } from "./ResumeCard";
import { KpiType } from "@/state/Kpis/GetSlice";
import { useEffect, useState } from "react";


export function Resume() {

    const employees = useSelector((state: RootState) => state.getEmployees.employees)
    const [kpis, setKpis] = useState<KpiType[] | []>(useSelector((state: RootState) => state.getKpis.kpis))
    const [average, setAverage] = useState<number>(0)




    useEffect(() => {

        const updatedKpis = kpis.map(kpi => {
            let value;
            if (kpi.currentTaux < kpi.minTaux && kpi.type == "eliminated") {
                value = "E";
            } else if (kpi.currentTaux < kpi.minTaux && kpi.type == "normal") {
                value = "D";
            } else if (kpi.currentTaux >= kpi.minTaux) {
                value = "C";
            } else {
                value = "N/A";
            }
            return { ...kpi, result: value };
        });

        const calculateAverage = (kpis: KpiType[]) => {
            let sum = 0;
            for (let kpi of kpis) {
                sum += kpi.currentTaux;
            }
            setAverage(Number((sum / kpis.length).toFixed(2)))
        }

        setKpis(updatedKpis)
        calculateAverage(updatedKpis)

    }, [])


    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ResumeCard
                title="Score Total"
                contentTitle={average}
                contentDescription="2023-2024"
                icon={
                    <svg viewBox="0 0 15 15"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-muted-foreground"
                        xmlns="http://www.w3.org/2000/svg"><path d="M7.49998 0.849976C7.22383 0.849976 6.99998 1.07383 6.99998 1.34998V3.52234C6.99998 3.79848 7.22383 4.02234 7.49998 4.02234C7.77612 4.02234 7.99998 3.79848 7.99998 3.52234V1.8718C10.8862 2.12488 13.15 4.54806 13.15 7.49998C13.15 10.6204 10.6204 13.15 7.49998 13.15C4.37957 13.15 1.84998 10.6204 1.84998 7.49998C1.84998 6.10612 2.35407 4.83128 3.19049 3.8459C3.36919 3.63538 3.34339 3.31985 3.13286 3.14115C2.92234 2.96245 2.60681 2.98825 2.42811 3.19877C1.44405 4.35808 0.849976 5.86029 0.849976 7.49998C0.849976 11.1727 3.82728 14.15 7.49998 14.15C11.1727 14.15 14.15 11.1727 14.15 7.49998C14.15 3.82728 11.1727 0.849976 7.49998 0.849976ZM6.74049 8.08072L4.22363 4.57237C4.15231 4.47295 4.16346 4.33652 4.24998 4.25C4.33649 4.16348 4.47293 4.15233 4.57234 4.22365L8.08069 6.74051C8.56227 7.08599 8.61906 7.78091 8.19998 8.2C7.78089 8.61909 7.08597 8.56229 6.74049 8.08072Z"></path>
                    </svg>
                }
            />
            <ResumeCard
                title="Employees Numbers"
                contentTitle={employees.length}
                contentDescription="2023-2024"
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                }
            />
            <ResumeCard
                title="Last Meeting"
                contentTitle="20/03/2024"
                contentDescription="2023-2024"
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                    </svg>
                }
            />
            <ResumeCard
                title="Next Meeting"
                contentTitle="20/09/2024"
                contentDescription="2023-2024"
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                }
            />
        </div>
    )

}