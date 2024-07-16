import { axiosInstance } from "@/lib/constants";
import { errorResponse } from "@/lib/utils";
import { TaskInsetType, TaskTableList, TaskType } from "@/types/task";
import { GenericRes } from "@/types/util";

export default class TaskService {
  static async getAllTasks() {
    try {
      const response = await axiosInstance.get<GenericRes<TaskType[]>>("tasks/get");
      return response.data;
    } catch (error) {
      return errorResponse(error);
    }
  }

  static async deleteTask(taskId: number) {
    try {
      const deletedTask = await axiosInstance.delete<GenericRes<boolean>>(
        `tasks/delete/${taskId}`
      );
      return deletedTask.data;
    } catch (error) {
      console.error(error);
      return errorResponse(error);
    }
  }

  static async saveTask(task: TaskInsetType) {
    try {
      const savedTask = await axiosInstance.post<GenericRes<TaskType>>("tasks/add", task);
      return savedTask.data;
    } catch (error) {
      return errorResponse(error);
    }
  }

  static async getTask(id:number){
    try {
        const res = await axiosInstance.get<GenericRes<TaskType>>(`tasks/get/${id}`);
        return res.data;
    } catch (error) {
      return errorResponse(error);
    }
  }

  static async updateTask(task:TaskType){
    try {
      const res = await axiosInstance.post<GenericRes<TaskType>>(`tasks/update/${task.id}`,task);
      return res.data;
    } catch (error) {
      return errorResponse(error);
    }
  }

  static async getTableList(){
    try {
      const response = await axiosInstance.get<GenericRes<TaskTableList[]>>("tasks/get-table-list");
      return response.data;
    } catch (error) {
      return errorResponse(error);
    }
  }
}
