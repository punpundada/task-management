import TaskService from "@/services/taskService";
import { PieChartData } from "@/types/task";
import React from "react";

const usePieChartData = (fromDate: string | null, toDate: string | null) => {
  const [chartData, setChartData] = React.useState<PieChartData[]>([]);
  const [loadingPieChart, setLoadingPieChart] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      if (!fromDate || !toDate) {
        return;
      }
      console.log("fromDate",fromDate);
      console.log("toDate",toDate);
      
      
      setLoadingPieChart(true);
      const monthPriviousDate = new Date();
      monthPriviousDate.setMonth(monthPriviousDate.getMonth() - 1);
      const res = await TaskService.getPieChartData(
        controller.signal,
        fromDate ? new Date(fromDate) : monthPriviousDate,
        toDate ? new Date(toDate) : new Date()
      );

      if (res?.isSuccess) {
        const data = res.result.map((x) => {
          if (x.status === "BACKLOG") {
            return { ...x, fill: "var(--color-BACKLOG)" };
          } else if (x.status === "TODO") {
            return { ...x, fill: "var(--color-TODO)" };
          } else if (x.status === "INPROGRESS") {
            return { ...x, fill: "var(--color-INPROGRESS)" };
          } else if (x.status === "DONE") {
            return { ...x, fill: "var(--color-DONE)" };
          } else if (x.status === "CANCLED") {
            return { ...x, fill: "var(--color-CANCLED)" };
          }
          return { ...x, fill: "var(--color-BACKLOG)" };
        });
        setChartData(data);
      }

      setLoadingPieChart(false);
    }
    fetchData();
    return () => {
      // controller.abort();
    };
  }, [fromDate, toDate]);

  return { chartData, loadingPieChart };
};

export default usePieChartData;

/*
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
*/
