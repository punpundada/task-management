import TaskService from "@/services/taskService"
import { TaskType } from "@/types/task"
import React from "react"

const useTasksList = ()=>{
    const [list,setList] = React.useState<TaskType[]>([])
    React.useEffect(()=>{
        const fetchData = async () => {
            const data = await TaskService.getAllTasks();
            if(data.isSuccess){
                setList(data.result);
            }
        }
        fetchData()
    },[])
    return list
}

export default useTasksList