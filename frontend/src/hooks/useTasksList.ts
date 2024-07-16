import TaskService from "@/services/taskService"
import { TaskTableList } from "@/types/task"
import React from "react"

const useTasksList = ()=>{
    const [list,setList] = React.useState<TaskTableList[]>([])
    React.useEffect(()=>{
        const fetchData = async () => {
            const data = await TaskService.getTableList();
            if(data.isSuccess){
                setList(data.result);
            }
        }
        fetchData()
    },[])
    return list
}

export default useTasksList