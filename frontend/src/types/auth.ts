import z from "zod";
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Please enter email" })
    .min(1)
    .email({ message: "Invalid email format" }),
  password: z
    .string({ required_error: "Please enter password" })
    .min(6, { message: "Password must be 6 or more digits" }),
});

export type LoginType = z.infer<typeof loginSchema>;