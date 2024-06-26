import { Router } from "express";
import AuthController from "../controller/auth";


const authRouter = Router();

authRouter.post("/signup",AuthController.registerUser)


export default authRouter