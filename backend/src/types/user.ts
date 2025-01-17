import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from "../db/schema";
import { emailSchema, passwordSchema } from "./utils";
import { z } from "zod";

export const userInsertSchema = createInsertSchema(user, {
  email: emailSchema,
  password:passwordSchema,
  createdAt: z.date().default(new Date()),
  isActive: z.boolean().default(true),
  name: z.string({ required_error: "Name is required" }),
  updatedAt: z.date().default(new Date()),
  email_verified:z.boolean().default(false)
});

export const userSelectSchema = createSelectSchema(user);

export type UserInsert = z.infer<typeof userInsertSchema>;

export type UserSelect = z.infer<typeof userSelectSchema>;
