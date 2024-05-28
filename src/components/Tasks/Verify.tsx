import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"; import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { Button } from "../ui/button";
import { updateTask } from "@/state/Tasks/UpdateSlice";
import { Timestamp } from "firebase/firestore";
import { BadgeAlertIcon, BadgeCheckIcon, BadgePlusIcon, ClockIcon } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { updateKpi } from "@/state/Kpis/UpdateSlice";
const cookies = new Cookies(null, { path: "/" });

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
    const user = cookies.get("user");
    const dispatch = useDispatch<AppDispatch>();


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
        await dispatch(updateTask({ id: info.id, updatedData: { status: "verified", currentTaux: newTaux, completedAt: Timestamp.fromDate(new Date()), kpiCode: info.kpiCode }, from: from, email: user.email }));
        await dispatch(updateKpi({ code: info.kpiCode, updatedData: { currentTaux: newTaux } }));
    }

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
