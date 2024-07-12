import { sha256 } from "oslo/crypto";
import nodemailer from "nodemailer";
import env from "./env";
import { encodeHex } from "oslo/encoding";
import type { Session, User } from "lucia";
import { session } from "../db/schema";

export const STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404,
  CREATED: 201,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED:401,
  FORBIDDEN:403,
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

export class CustomError extends Error{
  public code:number
  constructor(message:string,code:number){
    super(message)
    this.code=code
  }
}

export const getUserOrError =(locals:{
  user: User | null;
  session: Session | null;
})=>{
  if(!locals.user || !locals.session){
    throw new CustomError("Unauthorized",STATUS_CODES.UNAUTHORIZED)
  }
  return {user:locals.user,session:locals.session};
}