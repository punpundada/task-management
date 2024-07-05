import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useTasksList from "@/hooks/useTasksList";

const TaskList = () => {
  const taskList = useTasksList();
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
        <CardDescription className="text-base">
          Here's a list of your tasks for this month!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {taskList.map(task=>(
          <p>{task.title}</p>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskList;
