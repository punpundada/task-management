import TaskService from "@/services/taskService";
import { CalanderDataType } from "@/types/task";
import React from "react";

export default (date: Date) => {
  const [data, setData] = React.useState<Record<string, [CalanderDataType]>>({});

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await TaskService.getCalanderData(date);
      if (res.isSuccess) {
        setData(res.result);
      }
    };
    fetchData();
  }, [date]);

  return data;
};
