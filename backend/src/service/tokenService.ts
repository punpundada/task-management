import { eq } from "drizzle-orm";
import db from "../db";
import { restPasswordTable } from "../db/schema";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import type { ResetPasswordInsert } from "../types/resetPassword";
import { generateIdFromEntropySize } from "lucia";
import { createTokenHash } from "../utils/lib";

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

  static async deleteByUserId(userId:string){
   const data =  await db
    .delete(restPasswordTable)
    .where(eq(restPasswordTable.userId, userId)).returning();
    return data
  }

  static async saveResetPasswordData(data:ResetPasswordInsert){
    const savedData = await db.insert(restPasswordTable).values(data)
    return savedData
  }

  static async createPasswordResetToken(userId: string): Promise<string> {
    const deleTokenPromiese = TokenService.deleteByUserId(userId)
  
    const tokenId = generateIdFromEntropySize(25); // 40 character
    const tokenHashPromise =  createTokenHash(tokenId);
    const [_,tokenHash]= await Promise.all([deleTokenPromiese,tokenHashPromise])
  
    await TokenService.saveResetPasswordData({
      token_hash: tokenHash,
      userId: userId,
      expiresAt: createDate(new TimeSpan(1, "h")),
    })
  
    return tokenId;
  }
}

export default TokenService;
