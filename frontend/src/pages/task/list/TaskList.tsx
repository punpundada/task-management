import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "./data-table";
import { columns } from "./Columns";
import { useAuthContext } from "@/context/AuthContext";
import useTasksList from "@/hooks/useTasksList";

const TaskList = () => {
  const { user } = useAuthContext();
  const taskList = useTasksList()

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Welcome {user?.name}.
        </CardTitle>
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
