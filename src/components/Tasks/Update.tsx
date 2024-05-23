"use client";
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import {
  Form,
  FormControl,
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
import { Loader2, CheckCircle2, CircleX, Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import { clearMessageAndError, updateTask } from "@/state/Tasks/UpdateSlice";
import { Timestamp } from "firebase/firestore";
import Cookies from "universal-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const cookie = new Cookies(null, { path: "/" });


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  status: z.string({
    required_error: "Status is required",
  }),
  createdAt: z.string({
    required_error: "createdAt is required",
  }),
  assignedTo: z.any({
    required_error: "assignedTo is required",
  }),
  deadLine: z.any({
    required_error: "deadLine is required",
  }),
});

type infoProps = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done" | "verified";
  createdAt: string | Timestamp;
  deadLine: string | Timestamp;
  assignedTo: string;
  kpiCode: string;
};

type UpdateProps = {
  mode: "ghost" | "outline";
  info: infoProps;
};

const Update = ({ mode, info }: UpdateProps) => {
  const user = cookie.get("user");
  const isLoading = useSelector((state: RootState) => state.updateTask.loading);
  const message = useSelector((state: RootState) => state.updateTask.message);
  const error = useSelector((state: RootState) => state.updateTask.error);
  const employees = useSelector((state: RootState) => state.getEmployees.employees);

  // Initiale DeadLine Date
  let initialDate;
  if (info.deadLine instanceof Timestamp) {
    initialDate = info.deadLine.toDate();
  } else if (typeof info.deadLine === 'string') {
    initialDate = new Date(info.deadLine);
  } else {
    initialDate = new Date();
  }
  const [deadLine, setDeadLine] = React.useState<Date>(initialDate);

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

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

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Usage in your form default values:
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: info.title,
      description: info.description,
      status: info.status,
      createdAt: info.createdAt instanceof Timestamp ? formatDate(info.createdAt.toDate().toISOString()) : formatDate(info.createdAt),
      assignedTo: info.assignedTo,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    const createdAtTimestamp = Timestamp.fromDate(new Date(values.createdAt));
    const deadLineTimestamp = Timestamp.fromDate(new Date(deadLine));
    const data = {
      ...values,
      id: info.id,
      kpiCode: info.kpiCode,
      createdAt: createdAtTimestamp,
      deadLine: deadLineTimestamp
    }
    // Get current Component url
    const url = window.location.pathname;
    const from = url.substring(url.lastIndexOf('/') + 1);
    dispatch(updateTask({
      id: info.id,
      updatedData: data,
      from: from,
      email: user.email,
    }));
  }

  return (
    <>
      <Toaster />
      <Dialog>
        <DialogTrigger className="w-full cursor-pointer" asChild>
          <Button
            className="h-8 w-8 hover:text-yellow-500"
            variant={mode}
            size="icon"
          >
            <Edit size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[650px] sm:max-w-[700px] px-1">
          <ScrollArea className="h-full w-full p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-primary text-2xl">
                Update Task
              </DialogTitle>
              <DialogDescription>
                Fill in the form below to update task.
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
                        <Input disabled={user.role == "admin" ? false : true} placeholder="Title" {...field} />
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
                        <Input disabled={user.role === "admin" ? false : true} placeholder="Description" {...field} />
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
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Created At</FormLabel>
                      <FormControl>
                        <Input disabled={true} placeholder="Created At" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={user.role == "admin" ? false : true}
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
                      onSelect={(date) => {
                        if (date) {
                          setDeadLine(date);
                        }
                      }} initialFocus
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
                        disabled={user.role == "admin" ? false : true}
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
                              <div className="w-full h-full flex justify-center items-center gap-2">
                                <Avatar className="w-6 h-6 my-2 flex items-center justify-center cursor-pointer">
                                  <AvatarImage loading="lazy" src={employee.avatar} className="object-cover" />
                                  <AvatarFallback className="text-[9px]">
                                    {employee.firstName?.charAt(0).toUpperCase()}
                                    {employee.lastName?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{employee.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLoading ? (
                  <Button disabled={true}>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    <span>Updating Task...</span>
                  </Button>
                ) : (
                  <Button type="submit">Update</Button>
                )}
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Update;
