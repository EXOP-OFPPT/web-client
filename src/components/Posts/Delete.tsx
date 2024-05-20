"use client";
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

import { AppDispatch, RootState } from "@/state/store";
import { CheckCircle2, CircleX, Loader2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import { clearMessageAndError, deletePost } from "@/state/Posts/DeleteSlice";
import { Badge } from "../ui/badge";

interface DeleteProps {
  docId: string;
  fileName: string;
}

function Delete({ docId, fileName }: DeleteProps) {
  const isLoading = useSelector(
    (state: RootState) => state.deleteKpi.loading
  );
  const message = useSelector(
    (state: RootState) => state.deleteKpi.message
  );
  const error = useSelector((state: RootState) => state.deleteKpi.error);
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

  const deleteAction = (docId: string) => {
    dispatch(deletePost({ docId, fileName }));
  };

  return (
    <>
      <Toaster />
      <AlertDialog>
        <AlertDialogTrigger>
          <Badge variant="secondary" className="flex justify-center items-center gap-2 text-red-500 p-2 rounded-md">
            <Trash2 size={16} />
            <span>Delete</span>
          </Badge>
        </AlertDialogTrigger>
        <AlertDialogContent className="bor4der-2 bord5er-red-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {isLoading ? (
              <AlertDialogAction
                onClick={() => deleteAction(docId)}
                disabled
                className="bg-red-500 hover:bg-red-600"
              >
                <Loader2 className="animate-spin mr-2" />
                Please wait...
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={() => deleteAction(docId)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            )}
            {/* <AlertDialogAction>
              <Button
                className="hover:text-red-500"
                variant="outline"
                size="icon"
              >
                <Trash2 className="scale-[80%]" />
                <span>Delete</span>
              </Button>
            </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Delete;
