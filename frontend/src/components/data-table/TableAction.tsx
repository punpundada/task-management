import { CircleCheckBig, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTaskId, toCapitalCase } from "@/lib/utils";
import { TaskTableList } from "@/types/task";
import {  useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import TaskService from "@/services/taskService";
import { useToast } from "@/components/ui/use-toast";
import useTaskStore from "@/store/taskStore";

const TableAction = ({ task }: { task: TaskTableList }) => {
  const removeTaskById = useTaskStore(state=>state.removeTaskById);
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    const deletedTask = await TaskService.deleteTask(task.id);
    if(deletedTask.isSuccess){
      removeTaskById(task.id)
    }
    setOpen(false);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(getTaskId(task.id));
    toast({
      title: (
        <div className="flex gap-2 items-center">
          <CircleCheckBig />
          {`${getTaskId(task.id)} Copied to clipboard`}
        </div>
      ) as any,
    });
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopy}>Copy Task ID</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenView(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(`edit/${task.id}`)}>
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Delete <span className="">{getTaskId(task.id)}</span>
            </DialogTitle>
            <DialogDescription>Task will be deleted permanantly...</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Details:</DialogTitle>
            <DialogDescription>{getTaskId(task.id)}</DialogDescription>
          </DialogHeader>
          <DialogContent>
            {Object.entries(task).map(([key, value]) => {
              if (key === "project")
                return (
                  <div key={key} className="space-x-4">
                    <span>{toCapitalCase(key)+":"}</span>
                    <span>{value.name}</span>
                  </div>
                );
              if(key === 'projectId') return null
              return (
                <div key={key} className="space-x-4">
                  <span>{toCapitalCase(key)+":"}</span>
                  <span>{value}</span>
                </div>
              );
            })}
          </DialogContent>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenView(false)}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableAction;
