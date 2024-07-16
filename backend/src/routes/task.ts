import { Router } from "express";
import TaskController from "../controller/task";

const taskRouter = Router();

taskRouter.post('/add',TaskController.addTask)
taskRouter.get('/get',TaskController.getTasks)
taskRouter.get('/get-table-list',TaskController.getTableList)
taskRouter.get('/get/:id',TaskController.getTask)
taskRouter.post('/update/:id',TaskController.updateTask)
taskRouter.delete('/delete/:id',TaskController.deleteTask)

export default taskRouter