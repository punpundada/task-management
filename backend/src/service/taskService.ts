import { and, count, desc, eq, gte, lte, ne, not, sql } from "drizzle-orm";
import { task } from "../db/schema";
import {
  taskInsertSchema,
  tasksSelectSchema,
  type StatusType,
  type TaskCalanderDataType,
  type TaskInsert,
  type TaskPieChartDataType,
  type TaskSelect,
} from "../types/task";
import { undefined, z } from "zod";
import type { db } from "../db";
import { lastDayOfMonth, startOfMonth, getDate } from "date-fns";
import { CustomError, STATUS_CODES } from "../utils/lib";

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
    fromDate?: Date | undefined,
    toDate?: Date | undefined
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
    if (!taskToUpdate.createdDate) {
      taskToUpdate.createdDate = new Date();
    }

    const savedTask = await this.db.query.task.findFirst({
      where: eq(task.id, taskToUpdate.id),
    });
    if (!savedTask) {
      throw new CustomError("Task not found", STATUS_CODES.BAD_REQUEST);
    }
    taskToUpdate = { ...savedTask, ...taskToUpdate };
    const validTask = tasksSelectSchema.parse(taskToUpdate);
    switch (validTask.status) {
      case "TODO":
        if(savedTask.status != 'TODO')
        validTask.todoDate = new Date();
        break;
      case "BACKLOG":
        if(savedTask.status != 'BACKLOG')
        validTask.backlogDate = new Date();
        break;
      case "CANCLED":
        if(savedTask.status != 'CANCLED')
          validTask.cancledDate = new Date();
        break;
      case "DONE":
        if(savedTask.status != 'DONE')
          validTask.doneDate = new Date();
        break;
      case "INPROGRESS":
        if(savedTask.status != 'INPROGRESS')
          validTask.inprogressDate = new Date();
        break;
      default:
        break;
    }

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
          lte(task.createdDate, new Date(toDate))
        )
      );
    return countData as TaskPieChartDataType;
  }

  getCalanderData = async (date: Date) => {
    const firstDateOfMonth = startOfMonth(date);
    const lastDateOfMonth = lastDayOfMonth(date);
    const data = await this.db.query.task.findMany({
      where: and(
        gte(task.createdDate, firstDateOfMonth),
        lte(task.createdDate, lastDateOfMonth)
      ),
      columns: {
        title: true,
        createdDate: true,
        id: true,
        status: true,
        todoDate: true,
        backlogDate: true,
        cancledDate: true,
        doneDate: true,
        inprogressDate: true,
      },
    });

    const res: Record<string, [TaskCalanderDataType]> = {};

    data.forEach((item) => {
      let date: Date | null = new Date();

      switch (item.status) {
        case "TODO":
          date = item.todoDate;
          break;
        case "BACKLOG":
          date = item.backlogDate;
          break;
        case "CANCLED":
          date = item.cancledDate;
          break;
        case "DONE":
          date = item.doneDate;
          break;
        case "INPROGRESS":
          date = item.inprogressDate;
          break;
        default:
          break;
      }

      if (date) {
        const day = getDate(date).toString();
        if (!res[day]) {
          res[day] = [] as any;
        }
        res[day].push({
          date: date,
          id: item.id,
          status: item.status as StatusType,
          title: item.title,
        } as TaskCalanderDataType);
      }
    });

    return res;
  };
}

export default TasksService;
