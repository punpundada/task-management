import type { NextFunction, Request, Response } from "express";
import TasksService from "../service/taskService";
import type { TaskInsert, TaskSelect } from "../types/task";
import type { Res } from "../types/Res";
import { STATUS_CODES, getUserOrError } from "../utils/lib";
import { z } from "zod";

class TaskController {
  static async addTask(
    req: Request<unknown, unknown, TaskInsert>,
    res: Response<Res<TaskSelect>>,
    next: NextFunction
  ) {
    try {

      req.body.userId = getUserOrError(res.locals.user).id;

      const task = await TasksService.saveTasks(req.body);
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Task saved successfully",
        result: task[0],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(
    req: Request<unknown, unknown, unknown>,
    res: Response<Res<TaskSelect[]>>,
    next: NextFunction
  ) {
    try {
      const userId = getUserOrError(res.locals.user).id;

      const taskList = await TasksService.getTasks(userId);
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "tasks found",
        result: taskList,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(
    req: Request<{ id: number }, unknown, TaskSelect>,
    res: Response<Res<TaskSelect>>,
    next: NextFunction
  ) {
    try {
      getUserOrError(res.locals.user);
      const validId = z.number().parse(+req.params.id);
      if (req.body.id !== validId) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          isSuccess: false,
          issues: [],
          message: "Task id do not match",
        });
      }
      console.log('validId',validId);
      

      const savedTask = await TasksService.updateTaskById(req.body);
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Task updated successfully",
        result: savedTask[0],
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(
    req: Request<{id:number}, unknown, unknown>,
    res: Response<Res<boolean>>,
    next: NextFunction
  ){
    try {
      getUserOrError(res.locals.user);
      const isDeleted = await TasksService.deleteById(req.params.id);
      if(isDeleted){
        return res.status(STATUS_CODES.OK).json({
          isSuccess:true,
          message:"Task deleted successfully",
          result:isDeleted
        })
      }
      return res.status(STATUS_CODES.SERVER_ERROR).json({
        isSuccess:false,
        issues:[],
        message:"Task does not exist or was not deleted"
      })
    } catch (error) {
      next(error)
    }
  }
}

export default TaskController;