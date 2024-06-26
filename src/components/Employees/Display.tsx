import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ProfileCard from "./ProfileCard";
import { UserInterface } from "@/state/Auth/AuthSlice";

export default function DisplayEmployees() {
  const user = useSelector((state: RootState) => state.auth.user) as UserInterface;
  const data = useSelector((state: RootState) => state.getEmployees.employees);

  return (
    <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.filter(item => item.email !== user?.email).map((item, index) => {
        return <ProfileCard key={index} data={item} />;
      })}
    </div>
  );
}
