import db from "../db";
import { user } from "../db/schema";
import { type UserInsert } from "../types/user";
import lucia from "../utils/lucia";
import type { LoginUser } from "../types/auth";
import { emailSchema } from "../types/utils";
import { eq } from "drizzle-orm";

class AuthService {
  static async saveUser(userToSave: UserInsert) {
    const savedUser = await db.insert(user).values(userToSave).returning({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const session = await lucia.createSession(savedUser[0].id, {
      ip_country: "INDIA",
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    return { savedUser, sessionCookie };
  }

  static async login(loginData: LoginUser) {
    const validEmail = emailSchema.parse(loginData.email);

    const foundUser = await db.query.user.findFirst({
      where: eq(user.email, validEmail),
    });

    return { user: foundUser };
  }
}

export default AuthService;
