import { eachWeekendOfMonth } from "date-fns";
import React from "react";

const DashboardCalander = () => {
  const result = eachWeekendOfMonth(new Date());
  React.useEffect(() => {
    console.log(result);
  }, [result]);
  return <div>dashboard calander</div>;
};

export default DashboardCalander;
