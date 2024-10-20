import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import projectTable from "./project";
import { relations } from "drizzle-orm";

const projectIdea = sqliteTable("project_ideas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").references(() => projectTable.id).notNull(),
  title: text("title", { length: 25 }).notNull(),
  details: text("details").notNull(),
});

export default projectIdea;

export const projectIdeasRelations = relations(projectIdea, ({ one }) => ({
  project: one(projectTable, {
    fields: [projectIdea.projectId],
    references: [projectTable.id],
  }),
}));
