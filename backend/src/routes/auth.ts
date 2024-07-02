import { Router } from "express";
import AuthController from "../controller/auth";
import rateLimit from "express-rate-limit";


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 5 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from same ip, please try again later.',
  });

const authRouter = Router();

authRouter.post("/signup",limiter,AuthController.registerUser)
authRouter.post("/login",AuthController.login)
authRouter.post("/email-verification",AuthController.verifyEmail)
authRouter.post("/reset-password",limiter,AuthController.resetPassword)
authRouter.post("/reset-password/:token",AuthController.verifyRestPassword)
authRouter.get("/logout",AuthController.logout)
authRouter.get("/logout/all",AuthController.logoutAllDevices)
authRouter.get("/resend-email/:email",limiter,AuthController.resendOtp)


export default authRouter