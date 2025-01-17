import { desc, eq } from "drizzle-orm";
import db from "../db";
import { task } from "../db/schema";
import { taskInsertSchema, tasksSelectSchema, type TaskInsert, type TaskSelect } from "../types/task";
import { z } from "zod";

class TasksService {
  static async saveTasks(taskToSave: TaskInsert) {
    const validTask = taskInsertSchema.parse(taskToSave);
    return await db.insert(task).values(validTask).returning();
  }
  static async getTasks(userId:string){
    return await db.select().from(task).where(eq(task.userId,userId)).orderBy(desc(task.id));
  }
  static async updateTaskById(taskToUpdate:TaskSelect){
    const validTask = tasksSelectSchema.parse(taskToUpdate);
    return await db.update(task).set(validTask).where(eq(task.id,validTask.id)).returning()
  }

  static async deleteById(id:number){
    const validId = z.number().parse(+id);
   const isDeleted =  await db.delete(task).where(eq(task.id,validId))
    return isDeleted.rowsAffected !== 0
  }

  static async getTaskById(taskId:number){
    const validId = z.number().parse(+taskId);
    return await db.query.task.findFirst({
      where:eq(task.id,taskId)
    })
  }

  static async getTableList(userId:string){
    return await db.query.task.findMany({
      where:(eq(task.userId,userId)),
      orderBy:desc(task.id),
      with:{
        project:{
          columns:{
            name:true,
            id:true
          }
        }
      },
      columns:{
        userId:false,
        description:false,
      }
    })
  }
}


export default TasksService;