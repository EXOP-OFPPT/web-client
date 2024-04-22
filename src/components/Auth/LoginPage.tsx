"use client";
import { Toaster } from "@/components/ui/toaster";
import { Card } from "../ui/card";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { login } from "@/state/auth/AuthSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
// ----------------------------------------------
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";



const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});



export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "abdo@gmail.com",
      password: "123456",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    dispatch(login(values));
  }

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center">
      <Toaster />
      <Card className="h-[50vh] w-[380px] sm:w-[500px] md:w-[660px] 2xl:w-[660px] flex flex-col items-center gap-11 justify-center">
        <div className="absolute right-8 top-4">
          <ModeToggle />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-4/6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password..." type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
