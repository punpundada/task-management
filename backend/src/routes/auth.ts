import { Router } from "express";
import AuthController from "../controller/auth";


const authRouter = Router();

authRouter.post("/signup",AuthController.registerUser)
authRouter.post("/login",AuthController.login)
authRouter.post("/email-verification",AuthController.login)


export default authRouter