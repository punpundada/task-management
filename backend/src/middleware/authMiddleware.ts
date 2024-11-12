import type { NextFunction, Request, Response } from "express";
import type { Session } from "lucia";
import type { User } from "lucia";
import { verifyRequestOrigin } from "lucia";
import lucia from "../utils/lucia";
import env from "../utils/env";
import { CustomError, STATUS_CODES } from "../utils/lib";

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (env.NODE_ENV === "development") {
    return next();
  }
  if (req.method === "GET") {
    return next();
  }
  const originHeader = req.headers.origin ?? null;
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = req.headers.host ?? null;
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return res.status(403).end();
  }
};

export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize()
    );
  }
  res.locals.user = user;
  res.locals.session = session;
  return next();
};

export const mustValidateSession = async (
  req: Request<any, any, any, any>,
  res: Response<any>,
  next: NextFunction
) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    const err = new CustomError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
    return next(err);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    const err = new CustomError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
    return next(err);
    // return res.appendHeader(
    //   "Set-Cookie",
    //   lucia.createBlankSessionCookie().serialize()
    // );
  }
  res.locals.user = user;
  res.locals.session = session;
  return next();
};
declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
