"use client";
import { login } from "@/state/Auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { useNavigate } from "react-router-dom";
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
import "@/style/LoginStyle.css"
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Card } from "../ui/card";
import { ModeToggle } from "../global/mode-toggle";
import { Button } from "../ui/button";
import EXOP from "../../../public/EXOP-Make-crop.png";
// import icon from "@/assets/fingerprint.svg";
import arrow from "@/assets/arrow.svg";
import { Loader2 } from "lucide-react";
import { auth } from "@/firebase/firebase";
import { Toaster } from "../ui/toaster";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function Login() {
  const authUser = auth.currentUser;
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.auth.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "abdonsila222@gmail.com",
      password: "123456",
    },
  });


  useEffect(() => {
    if (user && authUser) {
      navigate("/app", { replace: true });
    }
  }, [navigate, user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(login(values));
  }

  return (
    <>
      <div style={{ position: "relative", zIndex: 9999 }}>
        <Toaster />
      </div>
      <div className="h-[100vh] flex flex-col items-center justify-center">
        {/* <Card className="h-[50vh] w-[380px] sm:w-[500px] md:w-[660px] 2xl:w-[660px] flex flex-col items-center gap-11 justify-center"> */}
        <section className="absolute right-8 top-4">
          <ModeToggle />
        </section>
        <Card className="container">
          <img onClick={() => navigate("/")} className="arrow bg-primary cursor-pointer" src={arrow} />
          <div className="form-container sign-in border-none">
            <Form {...form}>
              <form
                className="w-full space-y-3 text-center"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="social-icons flex justify-center items-center">
                  <img src={EXOP} alt="EXOP Logo" className="w-24 ml-3" />
                  {/* <img
                    className="fingerprint fill-current text-green-600"
                    src={icon}
                  /> */}
                </div>
                <h1>Connectez-vous</h1>
                <small>Utilisez votre email & mot de passe</small>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full !text-left">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="h-9"
                          placeholder="Enter your email address..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full !text-left">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="h-9"
                          placeholder="Enter your password..."
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2 p-0 m-0 text-center">
                  <small
                    onClick={() =>
                      navigate("resetPassword", { state: { from: "login" } })
                    }
                    className="cursor-pointer hover:text-sky-500"
                  >
                    Mot de Passe Oublier?
                  </small>
                  {isLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button type="submit">Connectez-vous</Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-right">
                <h1>Mission!</h1>
                <p>
                  permettre à tout unn chacun de révéler son plein potenntiel et
                  d'aquerir un métier pour aspirer à un meilleur avenir.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Login;
