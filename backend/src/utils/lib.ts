import { sha256 } from "oslo/crypto";
import nodemailer from "nodemailer";
import env from "./env";
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

export const hashPassword = async (password: string) => {
  return await Bun.password.hash(password, hashParams);
};
