import type { NextFunction, Request, Response } from "express";
import type {
  TaskCalanderDataType,
  TaskInsert,
  TaskPieChartDataType,
  TaskSelect,
} from "../types/task";
import type { Res } from "../types/Res";
import { CustomError, STATUS_CODES, getUserOrError } from "../utils/lib";
import { z } from "zod";
import type TasksService from "../service/taskService";
import { isValid } from "date-fns";
class TaskController {
  private service: TasksService;
  constructor(service: TasksService) {
    this.service = service;
  }

  async addTask(
    req: Request<unknown, unknown, TaskInsert>,
    res: Response<Res<TaskSelect>>,
    next: NextFunction
  ) {
    try {
      req.body.userId = getUserOrError(res.locals).user.id;
      req.body.createdDate = new Date();
      req.body.todoDate = new Date();
      const task = await this.service.saveTasks(req.body);
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Task saved successfully",
        result: task[0],
      });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(
    req: Request<
      unknown,
      unknown,
      unknown,
      { fromDate: Date | undefined; toDate: Date | undefined }
    >,
    res: Response<Res<TaskSelect[]>>,
    next: NextFunction
  ) {
    try {
      const userId = getUserOrError(res.locals).user.id;
      console.log("req.params", req.query);

      const taskList = await this.service.getTasks(
        userId,
        req.query.fromDate,
        req.query.toDate
      );
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "tasks found",
        result: taskList,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(
    req: Request<{ id: number }, unknown, TaskSelect>,
    res: Response<Res<TaskSelect>>,
    next: NextFunction
  ) {
    try {
      getUserOrError(res.locals);
      const validId = z.number().parse(+req.params.id);
      if (req.body.id !== validId) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          isSuccess: false,
          issues: [],
          message: "Task id do not match",
        });
      }

      const savedTask = await this.service.updateTaskById(req.body);
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Task updated successfully",
        result: savedTask[0],
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(
    req: Request<{ id: number }, unknown, unknown>,
    res: Response<Res<boolean>>,
    next: NextFunction
  ) {
    try {
      getUserOrError(res.locals);
      const isDeleted = await this.service.deleteById(req.params.id);
      if (isDeleted) {
        return res.status(STATUS_CODES.OK).json({
          isSuccess: true,
          message: "Task deleted successfully",
          result: isDeleted,
        });
      }
      return res.status(STATUS_CODES.SERVER_ERROR).json({
        isSuccess: false,
        issues: [],
        message: "Task does not exist or was not deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  async getTask(
    req: Request<{ id: number }, unknown, unknown>,
    res: Response<Res<TaskSelect>>,
    next: NextFunction
  ) {
    try {
      getUserOrError(res.locals);
      const task = await this.service.getTaskById(req.params.id);
      if (!task) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          isSuccess: false,
          issues: [],
          message: "Task not found",
        });
      }
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Request was successful",
        result: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTableList(
    req: Request<unknown, unknown, unknown>,
    res: Response<Res<any>>,
    next: NextFunction
  ) {
    try {
      const tableList = await this.service.getTableList(
        getUserOrError(res.locals)?.user.id
      );
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Request was successful",
        result: tableList ?? [],
      });
    } catch (error) {
      next(error);
    }
  }

  async getPieChartData(
    req: Request<unknown, unknown, { fromDate: Date; toDate: Date }, unknown>,
    res: Response<Res<TaskPieChartDataType>>,
    next: NextFunction
  ) {
    try {
      if (!req.body.fromDate || !req.body.toDate) {
        throw new CustomError(
          "From date and to Date must be passed as body",
          STATUS_CODES.BAD_REQUEST
        );
      }
      const data = await this.service.getPieChartData(
        new Date(req.body.fromDate),
        new Date(req.body.toDate)
      );

      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Request was successful",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  }

  getCalanderData = async (
    req: Request<{ date: Date }, unknown, unknown>,
    res: Response<Res<TaskCalanderDataType[]>>,
    next: NextFunction
  ) => {
    try {
      const valid = isValid(new Date(req.params.date));
      if (!valid) {
        throw new CustomError("Invalid Date", STATUS_CODES.BAD_REQUEST);
      }
      const data = await this.service.getCalanderData(req.params.date);
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Request was successful",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TaskController;
