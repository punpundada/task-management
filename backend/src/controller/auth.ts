import type { NextFunction, Request, Response } from "express";
import AuthService from "../service/authService";
import {
  userInsertSchema,
  type UserInsert,
  type UserSelect,
} from "../types/user";
import {
  STATUS_CODES,
  generateEmailVerificationCode,
  hashParams,
  transporter,
} from "../utils/lib";
import type { Res } from "../types/Res";
import type { LoginUser } from "../types/auth";
import lucia from "../utils/lucia";
import { generateIdFromEntropySize } from "lucia";
import env from "../utils/env";
import { emailOtpHTML } from "../views/EmailOTP";

class AuthController {
  static async registerUser(
    req: Request<unknown, unknown, UserInsert>,
    res: Response<Res<UserSelect>>,
    next: NextFunction
  ) {
    try {
      const userId = generateIdFromEntropySize(10);
      req.body.id = userId;

      const passwordHash = await Bun.password.hash(
        req.body.password,
        hashParams
      );

      req.body.password = passwordHash;

      req.body.id = userId;

      const validUser = userInsertSchema.parse(req.body);

      const { savedUser, sessionCookie } = await AuthService.saveUser(
        validUser
      );

      const verificationCode = await generateEmailVerificationCode(
        savedUser[0].id,
        savedUser[0].email
      );

      const emailSend = await transporter.sendMail({
        from: env.EMAIL_FROM,
        subject: "Varification OTP",
        to: savedUser[0].email,
        html: emailOtpHTML({
          name: "Tasks-app",
          otp: verificationCode,
          validFor: "15 mins",
        }),
      });

      res.set("Location", "/");
      res.set("Set-Cookie", sessionCookie.serialize());
      return res.status(STATUS_CODES.CREATED).json({
        isSuccess: true,
        message: "Signed up successfully",
        result: savedUser[0] as any,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request<unknown, unknown, LoginUser>,
    res: Response<Res<UserSelect>>,
    next: NextFunction
  ) {
    try {
      const { user } = await AuthService.login(req.body);
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          isSuccess: false,
          issues: [],
          message: "Email or Password is wrong",
        });
      }
      const isValidPassword = await Bun.password.verify(
        req.body.password,
        user.password,
        hashParams.algorithm
      );
      if (!isValidPassword) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          isSuccess: false,
          issues: [],
          message: "Email or Password is wrong",
        });
      }

      const session = await lucia.createSession(user.id, {
        ip_country: "INDIA",
      });
      const sessionCookie = lucia.createSessionCookie(session.id);
      res.set("Location", "/");
      res.set("Set-Cookie", sessionCookie.serialize());
      const { password, ...rest } = user;
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "User login successfully",
        result: rest as any,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(
    req: Request<unknown, unknown, LoginUser>,
    res: Response<Res<UserSelect>>,
    next: NextFunction
  ) {}
}

export default AuthController;
