import z from "zod";

export const taskSchema = z.object({
  id: z.number(),
  title: z
    .string({ required_error: "Please enter title" })
    .min(1, "Please enter title"),
  userId: z.string(),
  status: z.enum(["BACKLOG", "TODO", "INPROGRESS", "DONE", "CANCLED"], {
    errorMap: () => ({ message: "Please select status " }),
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    errorMap: () => ({ message: "Please select priority" }),
  }),
  label: z.enum(["BUG", "FEATURE", "DOCUMENTATION"], {
    errorMap: () => ({ message: "Please select label" }),
  }),
  description: z.string({ required_error: "Please enter valid description" }),
  projectId: z.coerce.number({
    required_error: "Please select project",
    invalid_type_error: "Please select",
  }),
});

export const taskSInsertchema = z.object({
  id: z.number().optional(),
  userId: z.string().optional(),
  title: z
    .string({ required_error: "Please enter title" })
    .min(1, "Please enter title"),
  status: z.enum(["BACKLOG", "TODO", "INPROGRESS", "DONE", "CANCLED"], {
    errorMap: () => ({ message: "Please select status " }),
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    errorMap: () => ({ message: "Please select priority" }),
  }),
  label: z.enum(["BUG", "FEATURE", "DOCUMENTATION"], {
    errorMap: () => ({ message: "Please select label" }),
  }),
  description: z
    .string({ required_error: "Please enter valid description" })
    .min(10, "Minimum 10 characters are required")
    .max(300, { message: "Max character count reached" }),
  projectId: z.coerce
    .number({
      errorMap: () => ({ message: "Please select project" }),
    })
    .min(1, "Please select project"),
});

export type TaskType = z.infer<typeof taskSchema>;

export type TaskInsetType = z.infer<typeof taskSInsertchema>;

export interface TaskTableList {
  id: number;
  title: string;
  status: string;
  priority: string;
  label: string;
  projectId: number;
  project: Project;
}

export interface Project {
  name: string;
  id: number;
}

export const statusSchema = z.enum([
  "BACKLOG",
  "TODO",
  "INPROGRESS",
  "DONE",
  "CANCLED",
]);

export type StatusType = z.infer<typeof statusSchema>;

export type TaskPieChartApi = {
  status: StatusType;
  count: number;
}[];

export type PieChartData = {
  status: StatusType;
  count: number;
  fill: string;
};
