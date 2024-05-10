import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import KpiCard from "./KpiCard";

export default function DisplayKpisCards() {
  const data = useSelector((state: RootState) => state.getKpis.kpis);

  return (
    <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((item, index) => {
        return <KpiCard key={index} data={item} />;
      })}
    </div>
  );
}
