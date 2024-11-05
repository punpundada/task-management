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
import { CalanderDataType } from "@/types/task";
import { getDate } from "date-fns";

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
      <Table className="rounded-lg border p-6">
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
                    "h-14 w-[calc(100%/7)]",
                    dayIndex % 2 === 0 ? "bg-slate-200" : "bg-slate-300"
                  )}
                >
                  <Cell
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
    </>
  );
};

export default DashboardCalander;

type CellProps = {
  date: Date | null;
  taskList?: CalanderDataType[];
};

function Cell({ date, taskList }: CellProps) {
  // const [searchParams] = useSearchParams()
  // const isCalanderPopupOpen = Boolean(searchParams.get("isCalanderPopupOpen")??false)
  if (!date) {
    return null;
  }
  // const sameDay = !!data?.date && isSameDay(date, data?.date);

  return (
    <div className="relative">
      {currentDate.getDate() === date.getDate() && (
        <div className="size-3 rounded-full bg-blue-800 absolute -top-3 right-0"></div>
      )}
      <div className="flex justify-center flex-col gap-1">
        {taskList?.map((task) => (
          <div
            className={cn("w-2/3 rounded-xl h-1", {
              "bg-[hsl(var(--chart-1))]": task.status === "BACKLOG",
              "bg-[hsl(var(--chart-2))]": task.status === "TODO",
              "bg-[hsl(var(--chart-3))]": task.status === "INPROGRESS",
              "bg-[hsl(var(--chart-4))]": task.status === "DONE",
              "bg-[hsl(var(--chart-5))]": task.status === "CANCLED",
            })}
            key={task.id}
          />
        ))}
      </div>
      <span className="absolute top-0 right-0 mr-[1px]">{date.getDate()}</span>
    </div>
  );
}
