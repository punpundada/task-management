import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TaskList = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
        <CardDescription className="text-base">
          Here's a list of your tasks for this month!
        </CardDescription>
      </CardHeader>
      <CardContent>HELLO</CardContent>
    </Card>
  );
};

export default TaskList;
