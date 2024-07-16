import InputControl from "@/components/formcontrol/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import ProjectService from "@/services/projectService";
import { ProjectInsetType, projectSchema } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { toast } = useToast();
  const form = useForm<ProjectInsetType>({
    defaultValues: { name: "" },
    mode: "onChange",
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectInsetType) => {
    const res = await ProjectService.saveProject(data);
    if (res.isSuccess) {
      toast({ title: "Success", description: res.message });
    } else {
      toast({ title: "Error", description: res.message, variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      <Card className="h-full lg:rounded-tr-none lg:rounded-br-none">first</Card>

      <div className="space-y-4">
        <Card className="lg:rounded-none h-40">CHART 1</Card>
        <Card className="lg:rounded-none h-64">CHART 2</Card>
        <Card className="lg:rounded-none h-[calc(90%-26rem)]">CHART 3</Card>
      </div>
      <div>
        <Card className="lg:rounded-tl-none lg:rounded-bl-none">
          <CardHeader>
            <CardTitle>Your projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <InputControl name="name" label="Project" placeholder="Add New Project" />
                <div>
                  <Button type="submit">Save project</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
