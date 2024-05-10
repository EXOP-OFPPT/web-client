"use client";

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
import { useEffect } from "react";
import { Toaster } from "../ui/toaster";
import { createKpi, clearMessageAndError } from "@/state/Kpis/CreateSlice";

const formSchema = z.object({
  code: z.string().min(2, {
    message: "Code must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  value: z.string().min(1, {
    message: "Value must be C | E.",
  }),
});


function Create() {
  const isLoading = useSelector(
    (state: RootState) => state.createKpi.loading
  );
  const message = useSelector(
    (state: RootState) => state.createKpi.message
  );
  const error = useSelector((state: RootState) => state.createKpi.error);
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
      code: crypto.randomUUID(),
      title: "Kpi 5",
      description: "Description Kpi 5",
      value: "C",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    dispatch(createKpi({ docId: values.code, kpiData: values }));
  }

  return (
    <>
      <Toaster />
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <ListPlusIcon size={20} className="mr-2" />
            <span>Add Kpi</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[650px] sm:max-w-[700px] px-1">
          <ScrollArea className="h-full w-full p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-primary text-2xl">
                Create Kpi
              </DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new Kpi.
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>code</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Value" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLoading ? (
                  <Button disabled>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    <span>Creating kpi...</span>
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
