import useTaskStore from "@/store/taskStore";
import { TaskTableList } from "@/types/task";
import React from "react";

const useTasksList = () => {
  const getTaskList = useTaskStore((s) => s.getTaskList);
  const [list, setList] = React.useState<TaskTableList[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setList(await getTaskList());
    };
    fetchData();
  }, [getTaskList]);
  
  return list;
};

export default useTasksList;
