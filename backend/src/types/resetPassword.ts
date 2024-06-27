import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import resetPasswordTable from "../db/schema/resetPassword";
import type { z } from "zod";


export const resetPasswordInsertSchema = createInsertSchema(resetPasswordTable)

export type ResetPasswordInsert = z.infer<typeof resetPasswordInsertSchema>