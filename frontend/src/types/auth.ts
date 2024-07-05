import z from "zod";
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Please enter email" })
    .min(1)
    .email({ message: "Invalid email format" }),
  password: z
    .string({ required_error: "Please enter password" })
});

export type LoginType = z.infer<typeof loginSchema>;