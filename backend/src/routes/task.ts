import { Router } from "express";
import TaskController from "../controller/task";
import TasksService from "../service/taskService";
import db from "../db";

const taskRouter = Router();

const service = new TasksService(db);
const controller = new TaskController(service);

taskRouter.post("/add", controller.addTask.bind(controller));
taskRouter.get("/get", controller.getTasks.bind(controller));
taskRouter.get("/get-table-list", controller.getTableList.bind(controller));
taskRouter.get("/get/:id", controller.getTask.bind(controller));
taskRouter.post("/update/:id", controller.updateTask.bind(controller));
taskRouter.delete("/delete/:id", controller.deleteTask.bind(controller));
taskRouter.post("/piechart", controller.getPieChartData.bind(controller));
taskRouter.get("/calander/:date", controller.getCalanderData.bind(controller));

export default taskRouter;
