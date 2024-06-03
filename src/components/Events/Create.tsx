"use client";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import {
  Loader2,
  CheckCircle2,
  CircleX,
  ListPlusIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import React, { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { clearMessageAndError, createEvent } from "@/state/Events/CreateSlice";
import { Timestamp } from "firebase/firestore";
import FancyMultipleSelect from "../global/FancyMultiSelect";
import { EmployeeType } from "@/state/Employees/GetSlice";
import Cookies from "universal-cookie";
import { EventType } from "@/state/Events/GetSlice";
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


function Create() {
  const user = cookies.get("user");
  const employees = useSelector((state: RootState) => state.getEmployees.employees);
  const isLoading = useSelector(
    (state: RootState) => state.createEvent.loading
  );
  const message = useSelector(
    (state: RootState) => state.createEvent.message
  );
  const error = useSelector((state: RootState) => state.createEvent.error);
  const [guests, setGuests] = React.useState<EmployeeType[]>([]);
  const [date, setDate] = React.useState<Date>();

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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Event 5",
      description: "Description Event 5",
      locationType: "physical",
      locationAddress: ""
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const docId = crypto.randomUUID();
    const startedAtTimestamp = Timestamp.fromDate(date ? new Date(date) : new Date());
    const createdAtTimestamp = Timestamp.fromDate(new Date());

    const data: EventType = {
      id: docId,
      title: values.title,
      description: values.description,
      location: {
        type: values.locationType,
        address: values.locationAddress
      },
      createdAt: createdAtTimestamp,
      startedAt: startedAtTimestamp,
      guests: guests.map(guest => ({ email: guest.email, avatar: guest.avatar?.photoURL || "", firstName: guest.firstName, lastName: guest.lastName }))
    }
    dispatch(createEvent({ docId, eventData: data, contribute: 'Create Event', email: user.email }))
  };


  return (
    <>
      <Toaster />
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <ListPlusIcon size={20} className="mr-2" />
            <span>Add Event</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[650px] sm:max-w-[700px] px-1">
          <ScrollArea className="h-full w-full p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-primary text-2xl">
                Create Event
              </DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new Event.
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
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* //! Select multiple guests employees */}
                <FancyMultipleSelect employees={employees} onSelectionChange={setGuests} defaultSelectedEmails={[user.email]} />
                {isLoading ? (
                  <Button disabled>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    <span>Creating Event...</span>
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

export default Create;
