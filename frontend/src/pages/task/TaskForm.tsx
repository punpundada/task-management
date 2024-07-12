import Combobox from "@/components/formcontrol/Combobox";
import InputControl from "@/components/formcontrol/Input";
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
import TaskService from "@/services/taskService";
import { TaskInsetType, taskSInsertchema } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<TaskInsetType>({
    resolver: zodResolver(taskSInsertchema),
    mode: "onChange",
    defaultValues: {
      label: "",
      priority: "",
      status: "",
      title: "",
      id: 0,
      userId: "",
    } as any,
  });

  const onSubmit = async (data: TaskInsetType) => {
    const savedTask = await TaskService.saveTask(data);
    if (savedTask.isSuccess) {
      toast({ title: "Success", description: savedTask.message });
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
      form.setValue("label", response.result.label);
      form.setValue("priority", response.result.priority);
      form.setValue("status", response.result.status);
      form.setValue("title", response.result.title);
      form.setValue("userId", response.result.userId);
    };
    fetchTask();
  }, [id, form.setValue]);

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>New Task.</CardTitle>
          <CardDescription>Add a new task</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <InputControl label={"Task Title"} name="title" />
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
              <div>
                <Button type="submit">Save</Button>
                <Button type="button" onClick={() => navigate("..")}>
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
