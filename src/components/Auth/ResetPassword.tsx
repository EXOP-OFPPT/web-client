import React, { useEffect } from "react";
import icon from "@/assets/fingerprint.svg";
// ----------------------------------------------------
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { useToast } from "../ui/use-toast";
import { clearMessageAndError, resetPassword } from "@/state/Auth/AuthSlice";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "../ui/toaster";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ModeToggle } from "../global/mode-toggle";
import arrow from "@/assets/arrow.svg";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

const ResetPassword: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const message = useSelector((state: RootState) => state.auth.message);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    // Check if state exists and if 'from' is not 'login'
    if (!location.state || location.state.from !== "login") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (message) {
      toast({
        variant: "default",
        title: "Plesae check your email!",
        description: message,
        className: "text-primary border-2 border-primary text-start",
        icon: <CheckCircle2 size={40} className="mr-2" />,
      });
      dispatch(clearMessageAndError());
    }
  }, [message]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    dispatch(resetPassword(values.email));
  }

  return (
    <>
      <div style={{ position: "relative", zIndex: 9999 }}>
        <Toaster />
      </div>
      <div className="h-[100vh] flex flex-col items-center justify-center">
        <section className="absolute right-8 top-4">
          <ModeToggle />
        </section>
        <Form {...form}>
          <form
            className="w-[90%] md:w-[550px] h-80"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <img onClick={() => navigate("/login")} className="relative top-[60%] right-5 cursor-pointer bg-primary rounded-full p-2" src={arrow} />
            <Card className="w-full h-full rounded-3xl flex flex-col gap-4 justify-center items-center px-10">
              <div className="social-icons">
                <img
                  className="fingerprint fill-current text-green-600 scale-125"
                  src={icon}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-base">
                      Confirm your Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="py-7 px-4"
                        placeholder="Enter your email address..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-6 w- animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button className="w-full" type="submit">
                  Send Email
                </Button>
              )}
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ResetPassword;
