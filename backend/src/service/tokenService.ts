import { eq } from "drizzle-orm";
import db from "../db";
import { restPasswordTable } from "../db/schema";
import { isWithinExpirationDate } from "oslo";

class TokenService {
  static async validateTokenHash(tokenHash: string) {
    const savedToken = await db.query.restPasswordTable.findFirst({
      where: eq(restPasswordTable.token_hash, tokenHash),
    });
    if (!savedToken || !isWithinExpirationDate(savedToken.expiresAt)) {
      return { isValid: false, savedToken: null };
    }
    return { isValid: true, savedToken: savedToken };
  }

  static async deleteTokeByUserId(userId: string) {
    return await db
      .delete(restPasswordTable)
      .where(eq(restPasswordTable.userId, userId))
      .returning();
  }
}

export default TokenService;
