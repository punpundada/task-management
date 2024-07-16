import Combobox from "@/components/formcontrol/Combobox";
import InputControl from "@/components/formcontrol/Input";
import TextField from "@/components/formcontrol/TextField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useProjectsList } from "@/hooks/useProjectList";
import TaskService from "@/services/taskService";
import { taskSInsertchema, TaskType } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const priority = [
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HIGH",
    label: "High",
  },
];

const label = [
  {
    value: "BUG",
    label: "Bug",
  },
  {
    value: "FEATURE",
    label: "Feature",
  },
  {
    value: "DOCUMENTATION",
    label: "Documentation",
  },
];

const status = [
  {
    value: "BACKLOG",
    label: "Backlog",
  },
  {
    value: "TODO",
    label: "Todo",
  },
  {
    value: "INPROGRESS",
    label: "Inprogress",
  },
  {
    value: "DONE",
    label: "Done",
  },
  {
    value: "CANCLED",
    label: "Cancled",
  },
];

const TaskForm = () => {
  const { id } = useParams();
  const projectList  = useProjectsList();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<TaskType>({
    resolver: zodResolver(taskSInsertchema),
    mode: "onChange",
    defaultValues: {
      label: "",
      priority: "",
      status: "",
      title: "",
      description: "",
      projectId:"",
    } as any,
  });

  const onSubmit = async (data: TaskType) => {
    if (id) {
      const updateRes = await TaskService.updateTask(data);
      if (updateRes.isSuccess) {
        toast({ title: "Success", description: updateRes.message });
        form.reset()
      } else {
        toast({
          title: "Error occured while saving task",
          description: updateRes.message,
          variant: "destructive",
        });
      }
      return;
    }
    const savedTask = await TaskService.saveTask(data);
    if (savedTask.isSuccess) {
      toast({ title: "Success", description: savedTask.message });
      form.reset()
    } else {
      toast({
        title: "Error occured while saving task",
        description: savedTask.message,
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (!id) return;
    const fetchTask = async () => {
      const response = await TaskService.getTask(+id);
      if (!response?.isSuccess) return;
      console.log(response.result.projectId)
      form.setValue("label", response.result.label);
      form.setValue("priority", response.result.priority);
      form.setValue("status", response.result.status);
      form.setValue("title", response.result.title);
      form.setValue("userId", response.result.userId);
      form.setValue("id", response.result.id);
      form.setValue("description",response.result.description)
      form.setValue("projectId",response.result.projectId.toString() as any);
    };
    fetchTask();
  }, [id, form]);
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{id ? "Edit Task" :"New Task."}</CardTitle>
          <CardDescription className="text-base">{id ? `Edit task with id: ${form.getValues('id')}` :"Add a new task"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputControl
                label={"Task Title"}
                name="title"
                placeholder="Enter Task Title"
              />
              <Combobox
                name="projectId"
                options={projectList}
                label="Project"
                placeHolder="Project"
              />
              <div className="col-span-full">
                <TextField
                  name="description"
                  label="Description"
                  placeholder="Enter Task Description"
                  className="h-24"
                />
              </div>
              <Combobox name="label" options={label} label="Label" placeHolder="Label" />
              <Combobox
                name="priority"
                options={priority}
                label="Priority"
                placeHolder="Priority"
              />
              <Combobox
                name="status"
                options={status}
                label="Status"
                placeHolder="Status"
              />

              <div className="flex gap-4 justify-end col-span-full">
                <Button type="submit">Save</Button>
                <Button type="button" onClick={() => navigate("..")} variant={"outline"}>
                  Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;
