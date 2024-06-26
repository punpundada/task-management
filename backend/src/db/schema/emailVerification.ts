import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import user from "./user";


const emaiVerification = sqliteTable("email_verification",{
    id:integer("id").primaryKey({autoIncrement:true}),
    code:text("code").notNull(),
    userId:text("user_id").notNull().references(()=>user.id).unique(),
    email:text("email").notNull(),
    expiresAt:integer("expires_at",{mode:"timestamp"}).notNull()
})

export default emaiVerification