"use client";
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/state/store";
import {
  Loader2,
  CheckCircle2,
  CircleX,
  ListPlusIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import { createTask, clearMessageAndError } from "@/state/Tasks/CreateSlice";
import { Timestamp } from "firebase/firestore";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });


const formSchema = z.object({
  id: z.string().min(2, {
    message: "Code must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  status: z.string({
    required_error: "Status is required",
  }),
  bonus: z.string({
    required_error: "Bonus Number is required",
  }),
  createdAt: z.string({
    required_error: "createdAt is required",
  }),
  assignedTo: z.string({
    required_error: "assignedTo is required",
  }),
  kpiCode: z.string({
    required_error: "kpiCode is required",
  }),

});

type CreateProps = {
  from: "global" | "kpi";
  mode: "ghost" | "outline";
  kpiCode: string;
  maxBonus: number;
};

function AddTask({ from, mode, kpiCode, maxBonus }: CreateProps) {
  const user = cookies.get("user");
  const employees = useSelector((state: RootState) => state.getEmployees.employees);
  const isLoading = useSelector(
    (state: RootState) => state.createTask.loading
  );
  const message = useSelector(
    (state: RootState) => state.createTask.message
  );
  const error = useSelector((state: RootState) => state.createTask.error);
  const [deadLine, setDeadLine] = React.useState<Date>();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();


  // useEffect(() => {
  //   if (employees.length === 0) {
  //     dispatch(getEmployees());
  //   }
  // }, [dispatch]);

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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      title: "Task 5",
      description: "Description Task 5",
      status: "todo",
      bonus: "0",
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      assignedTo: "",
      kpiCode: kpiCode,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert Date to Timestamp
    const docId = crypto.randomUUID();
    const createdAtTimestamp = Timestamp.fromDate(new Date(values.createdAt));
    const deadLineTimestamp = Timestamp.fromDate(deadLine ? new Date(deadLine) : new Date());
    const data = {
      id: docId,
      title: values.title,
      description: values.description,
      status: values.status,
      bonus: parseInt(values.bonus),
      createdAt: createdAtTimestamp,
      deadLine: deadLineTimestamp,
      assignedTo: values.assignedTo,
      kpiCode: values.kpiCode,
    };
    dispatch(createTask({ docId: docId, taskData: data, user: { role: user.role, email: user.email } }));
  }

  return (
    <>
      <Toaster />
      <Dialog>
        <DialogTrigger asChild>

          {from == "kpi" ?
            <Button>
              <ListPlusIcon size={20} className="mr-2" />
              <span>Add Task</span>
            </Button>
            :
            <Button
              className="h-8 w-8 hover:text-primary"
              variant={mode}
              size="icon"
            >
              <ListPlusIcon size={16} />
            </Button>
          }
        </DialogTrigger>
        <DialogContent className="h-[650px] sm:max-w-[700px] px-1">
          <ScrollArea className="h-full w-full p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-primary text-2xl">
                Create Task
              </DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new task.
              </DialogDescription>
            </DialogHeader>
            {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"> */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 px-2 my-2"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="todo">Todo</SelectItem>
                          <SelectItem value="inprogress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bonus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bonus</FormLabel>
                      <FormControl>
                        <Input min={1} max={maxBonus} type="number" placeholder="Bonus" {...field} />
                      </FormControl>
                      <FormDescription>Max Bonus to assigne to his task is {maxBonus}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Created At</FormLabel>
                      <FormControl>
                        <Input disabled type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadLine && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadLine ? format(deadLine, "PPP") : <span>Pick a deadLine</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadLine}
                      onSelect={setDeadLine}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Assigned To" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.email} value={employee.email}>
                              {employee.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLoading ? (
                  <Button disabled>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    <span>Creating task...</span>
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </form>
            </Form>
            {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddTask;
