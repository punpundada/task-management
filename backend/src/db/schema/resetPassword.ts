import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import user from "./user";

const resetPasswordTable = sqliteTable("reset_password",{
    token_hash:text('token_hash').unique().notNull(),
    userId:text("user_id").notNull().references(()=>user.id),
    expiresAt:integer("expires_at",{mode:"timestamp"}).notNull()
})

export default resetPasswordTable;