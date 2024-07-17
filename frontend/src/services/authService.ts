import { axiosInstance } from "../lib/constants";
import { LoginType, SignupType } from "../types/auth";
import { User } from "../types/user";
import { GenericRes } from "../types/util";

export default class AuthService {
  static async login(data: LoginType) {
    try {
      const response = await axiosInstance.post<GenericRes<User>>("auth/login", data);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static async logout() {
    try {
      const response = await axiosInstance.get<GenericRes<boolean>>("auth/logout");
      return response.data;
    } catch (error: any) {
      console.error(error);
      const ret: GenericRes<boolean> = {
        isSuccess: false,
        issues: [],
        message: error.message,
      };
      return ret;
    }
  }

  static async signup(data: SignupType) {
    try {
      const response = await axiosInstance.post<GenericRes<User>>("auth/signup", data);
      return response.data;
    } catch (error: any) {
      const ret: GenericRes<boolean> = {
        isSuccess: false,
        issues: [],
        message: error.message,
      };
      return ret;
    }
  }

  static async verifyOTP(otp: string) {
    try {
      const response = await axiosInstance.post<GenericRes<User>>(
        "auth/email-verification",
        { code: otp }
      );
      return response.data;
    } catch (error: any) {
      const ret: GenericRes<boolean> = {
        isSuccess: false,
        issues: [],
        message: error.message,
      };
      return ret;
    }
  }

  static async resendOTP(email: string) {
    try {
      const res = await axiosInstance.get<GenericRes<boolean>>(
        "auth/resend-email/" + email
      );
      return res.data;
    } catch (error: any) {
      const ret: GenericRes<boolean> = {
        isSuccess: false,
        issues: [],
        message: error.message,
      };
      return ret;
    }
  }
}
