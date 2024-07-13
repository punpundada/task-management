import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import user from "./user";
import { relations } from "drizzle-orm";

const projectTable = sqliteTable("projects",{
    id:integer("id").primaryKey({autoIncrement:true}),
    userId:text("user_id").references(()=>user.id).notNull(),
    name:text("name").notNull()
})

export default projectTable

export const projectRelations = relations(projectTable,({one})=>({
    user:one(user,{fields:[projectTable.userId],references:[user.id]})
}))