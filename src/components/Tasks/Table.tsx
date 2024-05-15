import { useSelector } from "react-redux";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { RootState } from "@/state/store";

export default function DisplayTasksTable() {
  const data = useSelector((state: RootState) => state.getTasks.tasks);

  return (
    <div className="w-full xlg:w-4/5 md:w-11/12">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
