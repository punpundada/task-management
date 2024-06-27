import { alphabet, generateRandomString } from "oslo/crypto";
import db from "../db";
import { emaiVerification } from "../db/schema";
import { eq } from "drizzle-orm";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { type User } from "lucia";

class EmailVerificationService {
  static async generateEmailVerificationCode(
    userId: string,
    email: string
  ): Promise<string> {
    await db
      .delete(emaiVerification)
      .where(eq(emaiVerification.userId, userId));

    const code = generateRandomString(8, alphabet("0-9"));

    await db.insert(emaiVerification).values({
      code,
      email,
      userId,
      expiresAt: createDate(new TimeSpan(15, "m")),
    });

    return code;
  }

  static async verifyVerificationCode(
    user: User,
    code: string
  ): Promise<boolean> {
    return await db.transaction(async (tx) => {
      const databaseCode = await tx.query.emaiVerification.findFirst({
        where: eq(emaiVerification.userId, user.id),
      });
      if (!databaseCode || databaseCode.code !== code) {
        return false;
      }
      const dd = await tx
        .delete(emaiVerification)
        .where(eq(emaiVerification.id, databaseCode.id))
        .returning();
      if (!isWithinExpirationDate(databaseCode.expiresAt)) {
        return false;
      }
      if (databaseCode.email !== user.email) {
        return false;
      }
      return true;
    });
  }


}

export default EmailVerificationService;
