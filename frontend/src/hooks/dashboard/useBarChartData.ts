import TaskService from "@/services/taskService";
import { BarChartType } from "@/types/task";
import React from "react";

export default function useBarChartData(half: number) {
  const [dataList, setDataList] = React.useState<BarChartType[]>([]);

  React.useEffect(() => {
    TaskService.getBarChartData(half).then((res) => {
      if (res.isSuccess) {
        setDataList(res.result);
      }
    });
  }, [half]);

  return dataList;
}
