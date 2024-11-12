import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCalanderData from "@/hooks/dashboard/useCalanderData";
import { cn } from "@/lib/utils";
import { getDate } from "date-fns";
import CalanderCell from "./CalanderCell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getCalendarDates(year: number, month: number): (Date | null)[][] {
  const dates: (Date | null)[][] = [];
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  let currentWeek: (Date | null)[] = [];

  for (let i = 0; i < startDate.getDay(); i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= endDate.getDate(); day++) {
    currentWeek.push(new Date(year, month, day));

    if (currentWeek.length === 7 || day === endDate.getDate()) {
      dates.push(currentWeek);
      currentWeek = [];
    }
  }

  return dates;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const currentDate = new Date();

const DashboardCalander = () => {
  const dateList = useCalanderData(currentDate);
  const calanderDates = getCalendarDates(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Calander</CardTitle>
        </CardHeader>
        <CardContent className="flex h-5/6 justify-center items-center">
          <Table className="rounded-lg border">
            <TableHeader>
              <TableRow>
                {days.map((x, index) => (
                  <TableHead
                    key={x}
                    className={cn(
                      "text-primary",
                      index % 2 === 0 ? "bg-slate-200" : "bg-slate-300"
                    )}
                  >
                    {x}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {calanderDates.map((week, index) => (
                <TableRow key={index}>
                  {week.map((date, dayIndex) => (
                    <TableCell
                      key={dayIndex}
                      className={cn(
                        "h-14 w-[calc(100%/7)] hover:bg-slate-400 rounded-sm",
                        dayIndex % 2 === 0 ? "bg-slate-200" : "bg-slate-300"
                      )}
                    >
                      <CalanderCell
                        date={date}
                        taskList={
                          date ? dateList[getDate(date).toString()] : undefined
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardCalander;
