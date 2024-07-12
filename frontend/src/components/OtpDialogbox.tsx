import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import React from "react";
import AuthService from "@/services/authService";
import { useToast } from "./ui/use-toast";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type props = {
  setOpen: (open: boolean) => void;
  open: boolean;
};

const OtpDialogbox = ({ open, setOpen }: props) => {
  const navigate = useNavigate();
  const { setEmail_verified, setData } = useAuthContext();
  const [triend, setTried] = React.useState(false);
  const { toast } = useToast();
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (value.length === 8) {
      const verifyUser = async () => {
        const data = await AuthService.verifyOTP(value);
        setTried(true);
        toast({
          title: data.isSuccess ? "Success" : "Error",
          description: data.message,
          variant: data.isSuccess ? "default" : "destructive",
        });

        setEmail_verified(data.isSuccess);
        setData({
          isAuthenticated: data.isSuccess,
          user: data.isSuccess ? data.result : undefined,
        });
        if (data.isSuccess) {
          localStorage.removeItem("user");
          localStorage.removeItem("email");
          navigate("../login");
          setOpen(false);
        }
      };
      verifyUser();
    }
  }, [navigate, setData, setEmail_verified, setOpen, toast, value]);

  const handleResendOTP = async () => {
    const data = await AuthService.resendOTP(
      localStorage.getItem("email") ?? ""
    );
    if (data.isSuccess) {
      setTried(false);
      setValue("");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OTP Verification</DialogTitle>
          <DialogDescription>
            Enter the OTP (One-Time Password) you received on email to verify
            your identity. OTP is valid for 15 minutes
          </DialogDescription>
        </DialogHeader>
        <DialogDescription className="flex justify-center items-center">
          {!triend ? (
            <InputOTP maxLength={8} value={value} onChange={setValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          ) : (
            <div className=" flex justify-center items-center gap-4">
              <span className="">Email verification failed</span>
              <Button onClick={handleResendOTP}>Resend OTP</Button>
            </div>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialogbox;
