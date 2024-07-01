import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { CirclePlus, ListOrdered, Settings } from "lucide-react";
const SideBar = () => {
  return (
    <div className="flex flex-col justify-between h-full py-9 px-2 border-r-2 items-center">
      <TooltipProvider delayDuration={100}>
        <div className="flex flex-col gap-4">
          <Tooltip>
            <TooltipTrigger>
              <Button variant={"ghost"} size={"icon"}>
                <ListOrdered />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={15} side="right">
              <p>Task List</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button variant={"ghost"} size={"icon"}>
                <CirclePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={15} side="right">
              <p>Add Task</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Button variant={"ghost"} size={"icon"}>
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={15} side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default SideBar;
