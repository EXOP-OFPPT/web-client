import AddEvent from "@/components/Events/Create";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch, RootState } from "@/state/store";
import { CheckCircle2, CircleX, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessageAndError, getEvents } from "@/state/Events/GetSlice";
import DisplayEventsTable from "@/components/Events/Table";
import { UserInterface } from "@/state/Auth/AuthSlice";


const Events: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user) as UserInterface;
    const isloading = useSelector(
        (state: RootState) => state.getEvents.loading
    );
    const message = useSelector((state: RootState) => state.getEvents.message);
    const error = useSelector((state: RootState) => state.getEvents.error);
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            toast({
                variant: "default",
                title: "Action dispatched",
                description: message,
                className: "text-primary border-2 border-primary text-start",
                icon: <CheckCircle2 size={40} className="mr-2" />,
            });
            dispatch(clearMessageAndError());
        } else if (error) {
            toast({
                variant: "default",
                title: "Action Failed",
                description: error?.message,
                className: "text-error border-2 border-error text-start",
                icon: <CircleX size={40} className="mr-2" />,
            });
            dispatch(clearMessageAndError());
        }
    }, [message, error]);

    return (
        <>
            <div className="h-[calc(100vh-4rem)] flex flex-col gap-2 items-center py-5">
                {/* Header */}
                <Card className="w-full xlg:w-4/5 md:w-11/12 flex justify-between items-end px-4 py-5 bg-transparent">
                    <div className="flex flex-col items-start">
                        <h6>Page</h6>
                        <h3 className="text-4xl font-bold text-primary">Events</h3>
                    </div>
                    <div className="h-full flex flex-col justify-center gap-2">
                        {/* Add Event */}
                        {user.role === "admin" && <AddEvent />}
                    </div>
                </Card>

                {/* Table */}
                {isloading ? (
                    <Loader2 className="h-10 w-10 mt-10 text-primary animate-spin" />
                ) : (
                    <>
                        <DisplayEventsTable />
                    </>
                )}
            </div>
        </>
    );
};

export default Events;





