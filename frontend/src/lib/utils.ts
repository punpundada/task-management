import { GenericRes } from "@/types/util";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const errorResponse = <T>(error: unknown) => {
  console.error(error);
  const ret: GenericRes<T> = {
    isSuccess: false,
    issues: [],
    message: "",
  };
  if (error instanceof Error) {
    ret.message = error.message;
  } else {
    ret.message = "Something went wrong";
  }
  return ret;
};
