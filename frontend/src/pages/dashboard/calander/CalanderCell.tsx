import { cn } from "@/lib/utils";
import { CalanderDataType } from "@/types/task";
import CalanderPopup from "./CalanderPopup";
import React from "react";

type CellProps = {
  date: Date | null;
  taskList?: CalanderDataType[];
};
const currentDate = new Date();

export default function CalanderCell({ date, taskList }: CellProps) {
  const [open, setOpen] = React.useState(false);

  if (!date) {
    return null;
  }

  function handleCellClick() {
    if (taskList?.length) {
      setOpen(true);
    }
  }

  return (
    <div
      className={cn("relative h-full", {
        "hover:cursor-pointer": taskList?.length ?? 0 > 0,
      })}
      onClick={handleCellClick}
    >
      {currentDate.getDate() === date.getDate() && (
        <div className="size-3 rounded-full bg-blue-800 absolute -top-1 right-0"></div>
      )}
      <div className="flex justify-center flex-col gap-1">
        {taskList?.map((task) => (
          <div
            className={cn("w-2/3 rounded-xl h-1", {
              "bg-[hsl(var(--chart-1))]": task.status === "BACKLOG",
              "bg-[hsl(var(--chart-2))]": task.status === "TODO",
              "bg-[hsl(var(--chart-3))]": task.status === "INPROGRESS",
              "bg-[hsl(var(--chart-4))]": task.status === "DONE",
              "bg-[hsl(var(--chart-5))]": task.status === "CANCLED",
            })}
            key={task.id}
          />
        ))}
      </div>
      <span className="absolute top-2 right-0 mr-[1px]">{date.getDate()}</span>
      <CalanderPopup
        date={date}
        open={open}
        setOpen={setOpen}
        taskList={taskList}
      />
    </div>
  );
}
