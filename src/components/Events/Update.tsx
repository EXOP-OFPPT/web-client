"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar";
import { format } from "date-fns"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

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
import React, { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import Cookies from "universal-cookie";
import { GuestType, LocationType } from "@/state/Events/GetSlice";
import { clearMessageAndError, updateEvent } from "@/state/Events/UpdateSlice";
import FancyMultipleSelect from "../global/FancyMultiSelect";
import { EmployeeType } from "@/state/Employees/GetSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
const cookies = new Cookies(null, { path: "/" });


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  // locationType is : pysical | virtual
  locationType: z.string().refine(value => value === "physical" || value === "virtual", {
    message: "Location Type must be either 'physical' or 'virtual'.",
  }),
  locationAddress: z.string().min(2, {
    message: "Location Address must be at least 2 characters.",
  }),
});

type infoProps = {
  id: string;
  title: string;
  description: string;
  location: LocationType;
  createdAt: Timestamp;
  startedAt: Timestamp;
  guests: GuestType[];
};

type UpdateProps = {
  mode: "ghost" | "outline";
  info: infoProps;
};

const Update = ({ mode, info }: UpdateProps) => {
  const user = cookies.get("user");
  const employees = useSelector((state: RootState) => state.getEmployees.employees);
  const isLoading = useSelector(
    (state: RootState) => state.updateEvent.loading
  );
  const message = useSelector(
    (state: RootState) => state.updateEvent.message
  );
  const [guests, setGuests] = React.useState<EmployeeType[]>([]);
  const error = useSelector((state: RootState) => state.updateEvent.error);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  // Initiale DeadLine Date
  let initialDate;
  if (info.startedAt instanceof Timestamp) {
    initialDate = info.startedAt.toDate();
  } else if (typeof info.startedAt === 'string') {
    initialDate = new Date(info.startedAt);
  } else {
    initialDate = new Date();
  }
  const [date, setDate] = React.useState<Date>(initialDate);

  // This effect runs when the component mounts and the info prop changes
  React.useEffect(() => {
    // Find the employees that are already guests
    const initialGuests = employees.filter(employee => info.guests.some(guest => guest.email === employee.email));

    // If such employees exist, add them to the guests state
    if (initialGuests.length > 0) {
      setGuests(initialGuests);
    }
  }, [employees, info.guests]);

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
      title: info.title,
      description: info.description,
      locationType: info.location.type,
      locationAddress: info.location.address,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    const startedAtTimestamp = Timestamp.fromDate(date ? new Date(date) : new Date());
    const data = {
      title: values.title,
      description: values.description,
      location: {
        type: values.locationType,
        address: values.locationAddress
      },
      startedAt: startedAtTimestamp,
      guests: guests.map(guest => ({ email: guest.email, avatar: guest.avatar?.photoURL || "", firstName: guest.firstName, lastName: guest.lastName }))
    };
    dispatch(updateEvent({ id: info.id, contribute: "Update Event", email: user.email, updatedData: data }));
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
                Update Event
              </DialogTitle>
              <DialogDescription>
                Fill in the form below to update Event.
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
                  name="locationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="virtual">Virtual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address or Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Address or Link" {...field} />
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
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a started Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(value) => {
                        if (value) {
                          setDate(value);
                        }
                      }} initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* //! Select multiple guests employees */}
                <FancyMultipleSelect employees={employees} onSelectionChange={setGuests} defaultSelectedEmails={guests.map(guest => guest.email)} />
                {isLoading ? (
                  <Button disabled>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    <span>Updating Event...</span>
                  </Button>
                ) : (
                  <Button type="submit">Update</Button>
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
};

export default Update;
