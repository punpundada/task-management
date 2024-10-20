import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { projectIdea } from "../db/schema";
import { z } from "zod";

export const projectIdeaInsertSchema = createInsertSchema(projectIdea, {
  details: z.string({ required_error: "Idea details are required" }),
  projectId: z.number({ required_error: "project id is required" }),
  title: z.string({ required_error: "title is required" }),
});

export const projectIdeaSelectSchema = createInsertSchema(projectIdea, {
  details: z.string({ required_error: "Idea details are required" }),
  projectId: z.number({ required_error: "project id is required" }),
  title: z.string({ required_error: "title is required" }),
  id: z.number({ required_error: "id is required" }),
});

export type ProjectIdeaInsetType = z.infer<typeof projectIdeaInsertSchema>;
export type ProjectIdeaSelectType = z.infer<typeof projectIdeaSelectSchema>;
