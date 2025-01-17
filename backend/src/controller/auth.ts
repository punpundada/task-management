import type { NextFunction, Request, Response } from "express";
import AuthService from "../service/authService";
import {
  userInsertSchema,
  type UserInsert,
  type UserSelect,
} from "../types/user";
import {
  STATUS_CODES,
  createTokenHash,
  getUserOrError,
  hashParams,
  hashPassword,
  transporter,
} from "../utils/lib";
import type { Res } from "../types/Res";
import type { LoginUser } from "../types/auth";
import lucia from "../utils/lucia";
import { generateIdFromEntropySize } from "lucia";
import env from "../utils/env";
import { emailOtpHTML } from "../views/EmailOTP";
import UserService from "../service/userService";
import { z } from "zod";
import { resetPasswordView } from "../views/restEmailHTML";
import { passwordSchema } from "../types/utils";
import TokenService from "../service/tokenService";
import EmailVerificationService from "../service/emailVerificationService";

class AuthController {
  static async registerUser(
    req: Request<unknown, unknown, UserInsert>,
    res: Response<Res<UserSelect>>,
    next: NextFunction
  ) {
    try {
      const userId = generateIdFromEntropySize(10);
      req.body.id = userId;

      const passwordHash = await hashPassword(req.body.password);

      req.body.password = passwordHash;

      req.body.id = userId;

      const validUser = userInsertSchema.parse(req.body);

      const { savedUser, sessionCookie } = await AuthService.saveUser(
        validUser
      );
      console.log('savedUser',savedUser)
      const verificationCode =
        await EmailVerificationService.generateEmailVerificationCode(
          savedUser[0].id,
          savedUser[0].email
        );
      console.log('verificationCode',verificationCode)

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
      console.log('emailSend',emailSend);
      
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
    req: Request<unknown, unknown, { code: string }>,
    res: Response<Res<UserSelect>>,
    next: NextFunction
  ) {
    try {
      const user = res.locals.user;
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          isSuccess: false,
          issues: [],
          message: "User not found",
        });
      }
      const code = req.body.code;
      if (typeof code !== "string") {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          isSuccess: false,
          issues: [],
          message: "Code should be string type",
        });
      }
      const validCode = await EmailVerificationService.verifyVerificationCode(
        user,
        code
      );
      if (!validCode) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          isSuccess: false,
          issues: [],
          message: "Verification failed",
        });
      }

      await lucia.invalidateUserSessions(user.id);
      user.email_verified = true;
      const updatedUser = UserService.updateUser(user as any);
      res.clearCookie("session")
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "User verified successfully",
        result: updatedUser as any,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    req: Request<unknown, unknown, { email: string }>,
    res: Response<Res<boolean>>,
    next: NextFunction
  ) {
    try {
      const validEmail = z
        .string({ required_error: "Email id is required" })
        .parse(req.body.email);
      const user = await UserService.findUserByEmail(validEmail);
      if (!user) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          isSuccess: false,
          issues: [],
          message: "User not found",
        });
      }
      const verificationToken = await TokenService.createPasswordResetToken(
        user.id
      );
      const verificationLink =
        `${env.FRONT_END_BASE_URL}/reset-password/` + verificationToken;

      const emailSend = await transporter.sendMail({
        from: env.EMAIL_FROM,
        subject: "Varification OTP",
        to: user.email,
        html: resetPasswordView({ redirectURL: verificationLink }),
      });
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Password reset Email send successfully",
        result: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyRestPassword(
    req: Request<{ token: string }, unknown, { password: string }>,
    res: Response<Res<boolean>>,
    next: NextFunction
  ) {
    try {
      const validPassword = passwordSchema.parse(req.body.password);
      const tokenHash = await createTokenHash(req.params.token);
      const { isValid, savedToken } = await TokenService.validateTokenHash(
        tokenHash
      );

      if (!isValid || !savedToken) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          isSuccess: false,
          message: "Invalid token",
          issues: [],
        });
      }
      const [_, user, hashedPassword]: [any, any, string] = await Promise.all([
        TokenService.deleteTokeByUserId(savedToken?.userId),
        UserService.findUserByUserId(savedToken.userId),
        hashPassword(req.body.password),
      ]);

      user.password = hashedPassword;
      await UserService.updateUser(user as any);
      const session = await lucia.createSession(savedToken.userId, {
        ip_country: "INDIA",
      });

      const sessionCookie = lucia.createSessionCookie(session.id);

      res.set("Location", "/");
      res.set("Set-Cookie", sessionCookie.serialize());
      res.set("Referrer-Policy", "strict-origin");

      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Password rest successfullt",
        result: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(
    req: Request,
    res: Response<Res<boolean>>,
    next: NextFunction
  ) {
    res.locals;
    try {
      const { session } = getUserOrError(res.locals);
      await lucia.invalidateSession(session.id);
      res.clearCookie('session')
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "User logged out successfully",
        result: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logoutAllDevices(
    req: Request,
    res: Response<Res<boolean>>,
    next: NextFunction
  ) {
    try {
      const { user } = getUserOrError(res.locals);
      await lucia.invalidateUserSessions(user.id);
      res.clearCookie('session')
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Logged out from all devices",
        result: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resendOtp(
    req: Request<{ email: string }>,
    res: Response<Res<boolean>>,
    next: NextFunction
  ) {
    try {
      const validEmail = z.string().parse(req.params.email);
      const user = await UserService.findUserByEmail(validEmail);
      if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          isSuccess: false,
          issues: [],
          message: "User not found",
        });
      }
      if (user.email_verified) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          isSuccess: false,
          issues: [],
          message: "User already verified",
        });
      }

      const [result, verificationCode] = await Promise.all([
        EmailVerificationService.deleteVerificationByUserId(user.id),
        EmailVerificationService.generateEmailVerificationCode(
          user.id,
          user.email
        ),
      ]);

      const emailSend = await transporter.sendMail({
        from: env.EMAIL_FROM,
        subject: "Varification OTP",
        to: user.email,
        html: emailOtpHTML({
          name: "Tasks-app",
          otp: verificationCode,
          validFor: "15 mins",
        }),
      });

      if (!emailSend.accepted) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({
          isSuccess: false,
          issues: [],
          message: "Email was not send",
        });
      }

      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Email send successfully",
        result: true,
      });
      
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
