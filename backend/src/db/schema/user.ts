import { relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import task from "./task";
import projectTable from "./project";

const user = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name", { length: 150 }).notNull(),
  email: text("email").unique().notNull(),
  password: text("password", { length: 255 }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
    email_verified:integer("email_verified",{mode:"boolean"}).default(false)
});

export const userRelations = relations(user, ({ many }) => ({
  tasks: many(task),
  projects:many(projectTable)
}));

export default user;
