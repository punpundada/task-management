import { z } from "zod";

export const projectSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ required_error: "Please enter name" })
    .min(1, { message: "Please enter name" }),
  userId: z.string().optional(),
});

export const projectSelectSchema = z.object({
  id: z.number(),
  name: z
    .string({ required_error: "Please enter name" })
    .min(1, { message: "Please enter name" }),
  userId: z.string(),
});

export type ProjectInsetType = z.infer<typeof projectSchema>;
export type ProjectSelectType = z.infer<typeof projectSelectSchema>;
