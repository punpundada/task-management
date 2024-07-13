import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { task } from "../db/schema";
import { z } from "zod";

export const taskInsertSchema = createInsertSchema(task, {
  label: z.enum(["BUG", "FEATURE", "DOCUMENTATION"], {
    required_error: "Label is required",
  }),
  userId: z.string({ required_error: "User id is required" }),
  title: z.string({ required_error: "Title is required" }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("LOW"),
  status: z.enum(["BACKLOG", "TODO", "INPROGRESS", "DONE", "CANCLED"], {
    required_error: "Status is required",
  }),
  description:z.string({required_error:"Description is a required filed"}),
  projectId:z.number({required_error:"Project id is required filed"}),
});

export const tasksSelectSchema = createSelectSchema(task);

export type TaskInsert = z.infer<typeof taskInsertSchema>;
export type TaskSelect = z.infer<typeof tasksSelectSchema>;
