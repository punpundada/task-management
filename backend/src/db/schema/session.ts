import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import user from "./user";

const session = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: integer("expires_at").notNull(),
});


export default session