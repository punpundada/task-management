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

export const getTaskId = (taskId: number) => {
  const id = taskId.toString();
  if (id.length > 4) return `TASK-${id}`;
  if (id.length === 1) return `TASK-000${id}`;
  if (id.length === 2) return `TASK-00${id}`;
  if (id.length === 3) return `TASK-0${id}`;
  return id;
};


export function toCapitalCase(str:string) {
  return str.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}