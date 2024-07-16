import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { projectTable } from "../db/schema";
import z from 'zod';

export const projectInsertSchema = createInsertSchema(projectTable,{
    name:z.string({required_error:"Project name is required"}),
    userId:z.string({required_error:"User id is required"})
})

export const projectSelectScema = createSelectSchema(projectTable,{
    name:z.string({required_error:"Project name is required"}),
    userId:z.string({required_error:"User id is required"})
});

export type ProjectInsetType = typeof projectTable.$inferInsert;
export type ProjectSelectType = typeof projectTable.$inferSelect;