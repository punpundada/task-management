import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import db from "../db";
import { emaiVerification } from "../db/schema";
import { eq } from "drizzle-orm";
import nodemailer, { type TransportOptions } from "nodemailer";
import env from "./env";



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


const transporterObj = {
  host: env.SMTP_HOST!,
  port: env.SMTP_PORT!,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER!, // generated brevo user
    pass: env.SMTP_PASS!, // generated brevo password
  },
}

export const transporter = nodemailer.createTransport(transporterObj as any);

