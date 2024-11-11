import type { NextFunction, Request, Response } from "express";
import { CustomError, STATUS_CODES } from "../utils/lib";
import { ZodError } from "zod";
import type { Res } from "../types/Res";
import { LibsqlError } from "@libsql/client";

export default function (
  error: Error,
  req: Request,
  res: Response<Res<any>>,
  next: NextFunction
) {
  console.error("Error:", error);
  
  if (error instanceof CustomError){
    return res.status(error.code).json({
      isSuccess:false,
      issues:[],
      message:error.message
    })
  }

  if(error instanceof LibsqlError){
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      isSuccess:false,
      issues:[],
      message:error.message
    })
  }

  if (error instanceof ZodError) {
    console.error(error.issues);
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      isSuccess: false,
      issues: error.issues,
      message: error.message,
    });
  }

  return res.status(STATUS_CODES.SERVER_ERROR).json({
    isSuccess:false,
    issues:[],
    message:error.message
  })
}
