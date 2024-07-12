import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import user from "./user";
import { relations } from "drizzle-orm";

const task = sqliteTable("tasks",{
    id:integer("id").primaryKey({autoIncrement:true}),
    title:text("title",{length:55}).notNull(),
    userId:text("user_id").notNull().references(()=>user.id),
    status:text("status",{enum:['BACKLOG',"TODO","INPROGRESS","DONE","CANCLED"]}).default("TODO"),
    priority:text('priority',{enum:['LOW',"MEDIUM","HIGH"]}).default('LOW'),
    label:text("label",{enum:["BUG","FEATURE","DOCUMENTATION"]}).notNull(),
    description:text("description",{length:300}).notNull()
})

export const taskRelations = relations(task,({one})=>({
    user:one(user,{fields:[task.userId],references:[user.id]})
}))


export default task