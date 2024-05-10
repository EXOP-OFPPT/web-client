import { useSelector } from "react-redux";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { RootState } from "@/state/store";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

export default function EmployeesTable() {
  const user = cookies.get("user");
  const data = useSelector((state: RootState) => state.getEmployees.employees);



  return (
    <div className="w-full xlg:w-4/5 md:w-11/12">
      <DataTable columns={columns} data={data.filter(item => item.email !== user.email)} />
    </div>
  );
}
