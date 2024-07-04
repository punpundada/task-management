import { axiosInstance } from "./lib/constants";
import { LoginType } from "./types/auth";
import { User } from "./types/user";
import { GenericRes } from "./types/util";

export default class AuthService {
  static async login(data: LoginType) {
    try {
      const response = await axiosInstance.post<GenericRes<User>>(
        "auth/login",
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
