import z from "zod";

export const taskSchema = z.object({
  id: z.number(),
  title: z.string({ required_error: "Please enter title" }),
  userId: z.string(),
  status: z.enum(["BACKLOG", "TODO", "INPROGRESS", "DONE", "CANCLED"], {
    required_error: "Please select status",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    required_error: "Please select proprity",
  }),
  label: z.enum(["BUG", "FEATURE", "DOCUMENTATION"], {
    required_error: "Please enter label",
  }),
});

export type TaskType = z.infer<typeof taskSchema>;
