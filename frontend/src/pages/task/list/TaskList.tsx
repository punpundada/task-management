import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useTasksList from "@/hooks/useTasksList";
import DataTable from "./data-table";
import { columns } from "./Columns";
import { useAuthContext } from "@/context/AuthContext";

const TaskList = () => {
  const taskList = useTasksList();
  const {user} = useAuthContext()
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome {user?.name}.</CardTitle>
        <CardDescription className="text-base">
          Here's a list of your tasks!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={taskList} />
      </CardContent>
    </Card>
  );
};

export default TaskList;
