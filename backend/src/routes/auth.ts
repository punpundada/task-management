import { Router } from "express";
import AuthController from "../controller/auth";


const authRouter = Router();

authRouter.post("/signup",AuthController.registerUser)
authRouter.post("/login",AuthController.login)
authRouter.post("/email-verification",AuthController.verifyEmail)
authRouter.post("/reset-password",AuthController.resetPassword)
authRouter.post("/reset-password/:token",AuthController.verifyRestPassword)


export default authRouter