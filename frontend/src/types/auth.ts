import z from "zod";
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Please enter email" })
    .min(1)
    .email({ message: "Invalid email format" }),
  password: z.string({ required_error: "Please enter password" }),
});

export type LoginType = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Please enter name" })
    .min(3, { message: "Name must be 3 or more characters" }),
  email: z
    .string({ required_error: "Please enter email" })
    .email({ message: "Invalid email format" }),
  password: z
    .string({ required_error: "Please enter password" })
    .min(6, { message: "Password must be 6 or more characters" })
    .max(64),
});

export type SignupType = z.infer<typeof signupSchema>;
