import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "../ui/button";
import { clearMessageAndError, deleteAccountAndDocument, logout, updateAccountPassword } from "@/state/Auth/AuthSlice";
import { Badge } from "../ui/badge";
import { AppDispatch, RootState } from "@/state/store";
import { useToast } from "../ui/use-toast";
import { CheckCircle2, CircleX, Loader2Icon } from "lucide-react";

type DetailsProps = {};

const Actions: React.FC<DetailsProps> = () => {
    const loading = useSelector(
        (state: RootState) => state.auth.loading
    );
    const message = useSelector(
        (state: RootState) => state.auth.message
    );
    const error = useSelector((state: RootState) => state.auth.error);
    const [password, setPassword] = useState<string>("")
    const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();

    // Then, in your component
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

    const updatePassword = () => {
        if (password) {
            dispatch(updateAccountPassword(password))
        }
    }

    const deleteAction = () => {
        dispatch(deleteAccountAndDocument())
        setTimeout(() => {
            dispatch(logout())
        }, 2000);
    }


    if (loading) {
        return (
            <div className='h-screen w-full flex justify-center items-center'>
                <Loader2Icon className="h-20 w-20 mt-10 text-primary animate-spin" />
            </div>
        )
    }
    return (
        <>
            <Card className="rounded-lg shadow-lg py-10 border-error-foreground">
                <div className="font-bold pb-7 px-7 uppercase text-error-foreground">Danger Zone</div>

                <div className="flex flex-col items-start px-7">
                    <div className="relative w-full">
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            type="text"
                            className="text-sm rounded-lg  block w-full p-3 outline-none"
                            placeholder="New Password"
                        />
                    </div>
                    <Button onClick={() => updatePassword()} className="mt-4">Update Password</Button>
                    <AlertDialog>
                        <AlertDialogTrigger className="h-70 w-70 mt-10">
                            <Badge variant={"destructive"} className="px-10 py-4 rounded-md">Delete Account</Badge>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bor4der-2 bord5er-red-500">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-red-500">
                                    Delete Account
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete your Account?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deleteAction()}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </Card>
        </>
    );
};

export default Actions;