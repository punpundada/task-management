import { and, count, desc, eq, gte, lte, ne } from "drizzle-orm";
import { task } from "../db/schema";
import {
  taskInsertSchema,
  tasksSelectSchema,
  type StatusType,
  type TaskInsert,
  type TaskPieChartDataType,
  type TaskSelect,
} from "../types/task";
import { undefined, z } from "zod";
import type { db } from "../db";

class TasksService {
  db: db;
  constructor(db: db) {
    this.db = db;
  }
  async saveTasks(taskToSave: TaskInsert) {
    const validTask = taskInsertSchema.parse(taskToSave);
    validTask.createdDate = new Date();
    return await this.db.insert(task).values(validTask).returning();
  }
  async getTasks(
    userId: string,
    fromDate: Date | undefined,
    toDate: Date | undefined
  ) {
    const getFilter = () => {
      if (fromDate && !toDate) {
        return and(
          eq(task.userId, userId),
          gte(task.createdDate, new Date(fromDate))
        );
      }
      if (!fromDate && toDate) {
        return and(
          eq(task.userId, userId),
          lte(task.createdDate, new Date(toDate))
        );
      }
      if (fromDate && toDate) {
        return and(
          eq(task.userId, userId),
          gte(task.createdDate, new Date(fromDate)),
          lte(task.createdDate, new Date(toDate))
        );
      }
      return and(eq(task.userId, userId));
    };

    return await this.db
      .select()
      .from(task)
      .where(getFilter())
      .orderBy(desc(task.id));
  }
  async updateTaskById(taskToUpdate: TaskSelect) {
    const validTask = tasksSelectSchema.parse(taskToUpdate);
    return await this.db
      .update(task)
      .set(validTask)
      .where(eq(task.id, validTask.id))
      .returning();
  }

  async deleteById(id: number) {
    const validId = z.number().parse(+id);
    const isDeleted = await this.db.delete(task).where(eq(task.id, validId));
    return isDeleted.rowsAffected !== 0;
  }

  async getTaskById(taskId: number) {
    const validId = z.number().parse(+taskId);
    return await this.db.query.task.findFirst({
      where: eq(task.id, taskId),
    });
  }

  async getTableList(userId: string) {
    return await this.db.query.task.findMany({
      where: eq(task.userId, userId),
      orderBy: desc(task.id),
      with: {
        project: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
      columns: {
        userId: false,
        description: false,
      },
    });
  }

  async getPieChartData(
    fromDate: Date,
    toDate: Date
  ): Promise<TaskPieChartDataType> {

    const countData = await this.db
      .select({ status: task.status, count: count() })
      .from(task)
      .groupBy(task.status)
      .where(
        and(
          gte(task.createdDate, new Date(fromDate)),
          lte(task.createdDate, new Date(toDate)),
        )
      );
    return countData as TaskPieChartDataType;
  }
}

export default TasksService;
