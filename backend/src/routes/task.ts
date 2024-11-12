import { Router } from "express";
import TaskController from "../controller/task";
import TasksService from "../service/taskService";
import db from "../db";
import { mustValidateSession } from "../middleware/authMiddleware";

const taskRouter = Router();

const service = new TasksService(db);
const controller = new TaskController(service);

taskRouter.post(
  "/add",
  mustValidateSession,
  controller.addTask.bind(controller)
);

taskRouter.get(
  "/get",
  mustValidateSession,
  controller.getTasks.bind(controller)
);

taskRouter.get(
  "/get-table-list",
  mustValidateSession,
  controller.getTableList.bind(controller)
);

taskRouter.get(
  "/get/:id",
  mustValidateSession,
  controller.getTask.bind(controller)
);

taskRouter.post(
  "/update/:id",
  mustValidateSession,
  controller.updateTask.bind(controller)
);

taskRouter.delete(
  "/delete/:id",
  mustValidateSession,
  controller.deleteTask.bind(controller)
);

taskRouter.post(
  "/piechart",
  mustValidateSession,
  controller.getPieChartData.bind(controller)
);

taskRouter.get(
  "/calander/:date",
  mustValidateSession,
  controller.getCalanderData.bind(controller)
);

export default taskRouter;
