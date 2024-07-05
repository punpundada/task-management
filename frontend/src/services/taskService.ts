import { axiosInstance } from "@/lib/constants";
import { errorResponse } from "@/lib/utils";
import { TaskType } from "@/types/task";
import { GenericRes } from "@/types/util";

export default class TaskService{
    static async getAllTasks(){
        try {
        const response = await axiosInstance.get<GenericRes<TaskType[]>>('tasks/get')
            return response.data
        } catch (error) {
            return errorResponse(error)
        }        
    }
}