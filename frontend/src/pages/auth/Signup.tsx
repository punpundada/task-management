import { Link } from "react-router-dom";
import undraw_signup from "@/assets/undraw_enter_uhqk.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupType } from "@/types/auth";
import { Form } from "@/components/ui/form";
import InputControl from "@/components/formcontrol/Input";
import { Button } from "@/components/ui/button";
import AuthService from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import OtpDialogbox from "@/components/OtpDialogbox";
import React from "react";

const Signup = () => {
  const { toast } = useToast();

  const [open, setOpen] = React.useState(false);

  const form = useForm<SignupType>({
    mode: "onChange",
    shouldFocusError: true,
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupType) => {
    const res = await AuthService.signup(data);

    toast({
      title: res.isSuccess ? "Success" : "Error",
      description: res.message,
      variant: res.isSuccess ? "default" : "destructive",
    });
    localStorage.setItem("email",data.email)
    setOpen(res.isSuccess);
  };

  return (
    <div className="flex h-screen">
      <div className="p-28 hidden w-1/2 h-full md:flex justify-center">
        <img src={undraw_signup} alt="signup-bro" className="object-contain" />
      </div>
      <div className="w-full md:w-1/2 p-1 md:p-2 lg:p-10 flex items-center justify-center">
        <Card className="w-[95%] md:w-[75%]">
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>Ready to get started?</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2 gap-2"
              >
                <InputControl
                  label="Name"
                  name="name"
                  disabled={form.formState.isSubmitting}
                />
                <InputControl
                  label="Email"
                  name="email"
                  disabled={form.formState.isSubmitting}
                />
                <InputControl
                  label="Password"
                  name="password"
                  type="password"
                  disabled={form.formState.isSubmitting}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Signup
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <span className="">Already have an account?</span>
            <Link to={"../login"} className="hover:underline">
              Login
            </Link>
          </CardFooter>
        </Card>
      </div>
      <OtpDialogbox open={open} setOpen={setOpen} />
    </div>
  );
};

export default Signup;
