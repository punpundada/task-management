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
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthService from "@/authService";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const {setData,isAuthenticated} =useAuthContext();
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
    toast(result?.message, { dismissible: true });
    navigate("/");
    if(result?.isSuccess && result?.result){
      setData({isAuthenticated:true,user:result.result})
      window.localStorage.setItem("user",JSON.stringify(result.result))
    }
  };
  if(isAuthenticated){
    return <Navigate to={'/'} />
  }
  return (
    <div className="flex h-screen bg-background">
      <div className=" p-10 hidden w-1/2 h-full md:flex justify-center">
        <img src={signupBro} alt="signup-bro" className="object-contain" />
      </div>
      <div className=" w-full md:w-1/2 p-1 md:p-2 lg:p-10 flex items-center justify-center">
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
                  type="password"
                  description={
                    <Link to={"../forgot-password"} className="hover:underline">
                      Forgot Password?
                    </Link>
                  }
                />
                <Button type="submit" className="">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-sm">
            <span className="mr-2">Don't have an account?</span>
            <Link to={"../signup"} className="hover:underline">
              Signup
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
