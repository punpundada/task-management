import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet, sha256 } from "oslo/crypto";
import db from "../db";
import { emaiVerification, restPasswordTable } from "../db/schema";
import { eq } from "drizzle-orm";
import nodemailer, { type TransportOptions } from "nodemailer";
import env from "./env";
import { generateIdFromEntropySize, type User } from "lucia";
import e from "express";
import { encodeHex } from "oslo/encoding";

export const STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404,
  CREATED: 201,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
} as const;

export const hashParams = {
  memoryCost: 19456,
  timeCost: 2,
  algorithm: "argon2id",
} as const;

export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  await db.delete(emaiVerification).where(eq(emaiVerification.userId, userId));

  const code = generateRandomString(8, alphabet("0-9"));

  await db.insert(emaiVerification).values({
    code,
    email,
    userId,
    expiresAt: createDate(new TimeSpan(15, "m")),
  });

  return code;
}

export async function verifyVerificationCode(
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

const transporterObj = {
  host: env.SMTP_HOST!,
  port: env.SMTP_PORT!,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER!, // generated brevo user
    pass: env.SMTP_PASS!, // generated brevo password
  },
};

export const transporter = nodemailer.createTransport(transporterObj as any);

export async function createTokenHash(tokenId: string) {
  return encodeHex(await sha256(new TextEncoder().encode(tokenId)));
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  await db
    .delete(restPasswordTable)
    .where(eq(restPasswordTable.userId, userId));

  const tokenId = generateIdFromEntropySize(25); // 40 character
  const tokenHash = await createTokenHash(tokenId);

  await db.insert(restPasswordTable).values({
    token_hash: tokenHash,
    userId: userId,
    expiresAt: createDate(new TimeSpan(1, "h")),
  });

  return tokenId;
}
