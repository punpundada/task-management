import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { CirclePlus, ListOrdered } from "lucide-react";
import SettingMenu from "./SettingMenu";


const SideBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between h-full py-9 px-2 border-r-2 items-center">
      <TooltipProvider delayDuration={70}>
        <div className="flex flex-col gap-4">
          <Tooltip>
            <TooltipTrigger>
              <Button variant={"ghost"} size={"icon"} onClick={() => navigate("/")}>
                <ListOrdered />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={7} side="right">
              <p>Task List</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button variant={"ghost"} size={"icon"} onClick={() => navigate("/add")}>
                <CirclePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={7} side="right">
              <p>Add Task</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <SettingMenu/>
            </TooltipTrigger>
            <TooltipContent sideOffset={7} side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default SideBar;
