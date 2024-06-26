import { relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import task from "./task";

const user = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name", { length: 150 }).notNull(),
  email: text("email").unique().notNull(),
  password: text("password", { length: 255 }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
  tasks: many(task, { relationName: "one-user-many-tasks" }),
}));

export default user;
