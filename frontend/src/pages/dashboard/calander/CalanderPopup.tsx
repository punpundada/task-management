import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CalanderDataType } from "@/types/task";
import { Navigation } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export type CalanderPopupProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date;
  taskList?: CalanderDataType[] | null;
};

const CalanderPopup = (props: CalanderPopupProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="w-full md:w-3/4 lg:w-5/6">
        <DialogHeader>
          <DialogTitle>Task Status Overview</DialogTitle>
          <DialogDescription>
            Status updates for tasks on {props.date.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80">
          <div className="space-y-3">
            {props?.taskList?.map((task) => (
              <>
                <div
                  className={cn(
                    "rounded-xl w-full flex h-14 justify-center items-center",
                    {
                      "bg-[hsl(var(--chart-1))]": task.status === "BACKLOG",
                      "bg-[hsl(var(--chart-2))]": task.status === "TODO",
                      "bg-[hsl(var(--chart-3))]": task.status === "INPROGRESS",
                      "bg-[hsl(var(--chart-4))]": task.status === "DONE",
                      "bg-[hsl(var(--chart-5))]": task.status === "CANCLED",
                    }
                  )}
                  key={task.id}
                >
                  <span className="text-start ps-2 w-[60%]">{task.title}</span>
                  <span className="text-start w-[25%] ps-3 border-l-2">
                    {task.status}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={"/tasks/edit/" + task.id}
                          className="w-[10%] mt-1 flex justify-center border-l-2"
                        >
                          <Navigation className="" size={20} />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View task details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CalanderPopup;
