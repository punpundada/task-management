import { z } from "zod";

export const emailSchema = z.string({required_error:"Email is required"}).email({message:"Incorrect Email format"})

export const passwordSchema = z.string({required_error:"Password is required"}).min(6,{message:"Password must be at least 6 character long"})