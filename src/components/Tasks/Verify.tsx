import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { Button } from "../ui/button";
import { updateTask } from "@/state/Tasks/UpdateSlice";
import { Timestamp } from "firebase/firestore";
import { BadgeAlertIcon, BadgeCheckIcon, BadgePlusIcon, ClockIcon } from "lucide-react";
import { updateCurrentTauxTask } from "@/state/Kpis/UpdateSlice";
const cookies = new Cookies(null, { path: "/" });

type infoProps = {
    id: string;
    title: string;
    description: string;
    status: "todo" | "inprogress" | "done" | "verified";
    createdAt: string | Timestamp;
    deadLine: string | Timestamp;
    assignedTo: string;
    kpiCode: string;
    bonus: number;
};

type VerifyProps = {
    info: infoProps;
};

const Verify = ({ info }: VerifyProps) => {
    const user = cookies.get("user");
    const dispatch = useDispatch<AppDispatch>();

    if (user.role === "user" && info.status === "done") {
        return (
            <Button variant={"outline"} className="w-22 cursor-default !no-underline"
                onClick={() => {
                    console.log("Send to verify: from: ", user.email, "to: ", "admin");
                    // dispatch(updateTask({ id: id, updatedData, user }));
                }}>
                <ClockIcon size={20} className="mr-2" />
                <span className="test-sm">Wait for Verify</span>
            </Button>
        );
    } else if (user.role === "admin" && info.status === "done") {
        return (
            <Button variant={"outline"} className="w-22"
                onClick={() => {
                    dispatch(updateTask({ id: info.id, updatedData: { status: "verified", completedAt: Timestamp.fromDate(new Date()) }, user: { role: user.role, email: user.email } }));
                    dispatch(updateCurrentTauxTask({ code: info.kpiCode, bonus: info.bonus, user: { role: user.role, email: user.email } }));
                }}>
                <BadgePlusIcon size={15} className="mr-1" />
                To Verify
            </Button>
        );
    } else if (info.status === "verified") {
        return (
            <Button
                variant={"link"} className="w-22 cursor-default !no-underline">
                <BadgeCheckIcon size={15} className="mr-2" />
                Verified
            </Button>
        );
    }
    else {
        return (
            <Button variant={"outline"} className="w-22" disabled={true}>
                <BadgeAlertIcon size={14} className="mr-1" />
                Unverified
            </Button>
        );
    }
}

export default Verify;
