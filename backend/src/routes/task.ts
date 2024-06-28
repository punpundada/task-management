import { Router } from "express";
import TaskController from "../controller/task";

const taskRouter = Router();

taskRouter.post('/add',TaskController.addTask)
taskRouter.get('/get',TaskController.getTasks)
taskRouter.post('/update/:id',TaskController.updateTask)
taskRouter.delete('/delete/:id',TaskController.deleteTask)

export default taskRouter