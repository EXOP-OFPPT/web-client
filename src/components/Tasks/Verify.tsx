import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"; import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { updateTask } from "@/state/Tasks/UpdateSlice";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { BadgeAlertIcon, BadgeCheckIcon, BadgePlusIcon, ClockIcon } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { updateKpi } from "@/state/Kpis/UpdateSlice";
import { UserInterface } from "@/state/Auth/AuthSlice";
import { useEffect, useState } from "react";
import { KpiType } from "@/state/Kpis/GetSlice";
import { db } from "@/firebase/firebase";

type infoProps = {
    id: string;
    title: string;
    probleme: string;
    status: "todo" | "inprogress" | "done" | "verified";
    createdAt: string | Timestamp;
    deadLine: string | Timestamp;
    assignedTo: string;
    kpiCode: string;
};

type VerifyProps = {
    info: infoProps;
};

const formSchema = z.object({
    newTaux: z.any(),
});


const Verify = ({ info }: VerifyProps) => {
    const [kpiTaskInfo, setKpiTaskInfo] = useState<KpiType | null>(null);
    const user = useSelector((state: RootState) => state.auth.user) as UserInterface;
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        const fetchKpiTaskInfo = async () => {
            const docRef = doc(db, "kpis", info.kpiCode);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as KpiType;
                setKpiTaskInfo(data);
            } else {
                console.log("No such document!");
            }
        };

        fetchKpiTaskInfo();
    }, [info.kpiCode]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newTaux: 0,
        },
    });

    const verify = async (values: z.infer<typeof formSchema>) => {
        const newTaux = Number(values.newTaux);
        // Get current Component url
        const url = window.location.pathname;
        const from = url.substring(url.lastIndexOf('/') + 1);
        await dispatch(updateTask({ id: info.id, contribute: "Verify Task", kpiCode: info.kpiCode, updatedData: { status: "verified", currentTaux: newTaux, updatedAt: Timestamp.fromDate(new Date()), completedAt: Timestamp.fromDate(new Date()) }, from: from, email: user?.email }));
        await dispatch(updateKpi({ code: info.kpiCode, contribute: "Update Score", email: user?.email, updatedData: { currentTaux: newTaux } }));
    }

    if (user.role === "user" && info.status === "done") {
        return (
            <Button variant={"outline"} className="w-22 cursor-default !no-underline"
                onClick={() => {
                    console.log("Send to verify: from: ", user?.email, "to: ", "admin");
                    // dispatch(updateTask({ id: id, updatedData, user }));
                }}>
                <ClockIcon size={20} className="mr-2" />
                <span className="test-sm">Wait for Verify</span>
            </Button>
        );
    } else if (user.role === "admin" && info.status === "done") {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"outline"} className="w-22">
                        <BadgePlusIcon size={14} className="mr-1" />
                        Verify Now
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Task</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Enter new score for this task
                    </DialogDescription>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(verify)}
                            className="space-y-8 px-2 my-2"
                        >
                            <FormField
                                control={form.control}
                                name="newTaux"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New score</FormLabel>
                                        <FormControl>
                                            <Input min={1} max={100} type="number" placeholder="Enter new score" {...field} />
                                        </FormControl>
                                        <FormDescription>The current Score is {kpiTaskInfo?.currentTaux}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button variant="outline" className="w-22 bg-success hover:bg-success-foreground">Verify</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        );
    } else if (info.status === "verified") {
        return (
            <Button
                variant={"link"} className="w-22 text-success cursor-default !no-underline">
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
