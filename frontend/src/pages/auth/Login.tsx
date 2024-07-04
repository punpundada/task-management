import signupBro from "@/assets/Sign up-bro.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, LoginType } from "@/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import InputControl from "@/components/formcontrol/Input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AuthService from "@/authService";
import { toast } from "sonner";
const Login = () => {
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    shouldFocusError: true,
  });
  const onSubmit = async (data: LoginType) => {
    const result = await AuthService.login(data);
    toast(result?.message);
  };
  return (
    <div className="flex h-screen bg-background">
      <div className=" p-10 hidden w-1/2 h-full md:flex justify-center">
        <img src={signupBro} alt="signup-bro" className="object-contain" />
      </div>
      <div className="w-1/2 p-10 flex items-center justify-center">
        <Card className="w-[95%] md:w-[75%]">
          <CardHeader>
            <CardTitle>Login bro!!</CardTitle>
            <CardDescription>
              Welcome to TODOs! use the form below to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2 gap-4"
              >
                <InputControl label="Email" name="email" placeholder="Email" />
                <InputControl
                  label="Password"
                  name="password"
                  placeholder="Password"
                />
                <Button type="submit" className="">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Link to={"forget-password"} className="hover:underline">
              Forgot Password?
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
