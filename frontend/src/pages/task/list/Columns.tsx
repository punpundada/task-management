import TableAction from "@/components/TableAction";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getTaskId, toCapitalCase } from "@/lib/utils";
import { TaskType } from "@/types/task";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoveUp } from "lucide-react";

// export const columns =[
//     columnHelper.accessor('id',{
//         id: "taskId",
//         header:"Task Id",
//         cell:info=>getTaskId(info.getValue()),
//     }),
//     columnHelper.accessor('label',{
//         id:"lable",
//         header:"Label",
//         cell:info=>info.getValue()
//     }),
//     columnHelper.accessor('title',{
//         id:"title",
//         header:"Title",
//         cell:info=>info.getValue()
//     }),
//     columnHelper.accessor('status',{
//         id:"status",
//         header:"Status",
//         cell:info=>info.getValue()
//     }),
//     columnHelper.accessor('priority',{
//         id:"priority",
//         header:"Priority",
//         cell:info=>info.getValue()
//     }),

// ]

// const SortingButton = ({ column }: { Column: Column<TaskType> }) => {
//   return (
//     <Button
//       variant="ghost"
//       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//     >
//       Email
//       <ArrowUpDown className="ml-2 h-4 w-4" />
//     </Button>
//   );
// };

export const columns: ColumnDef<TaskType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="grid place-content-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="grid place-content-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10,
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <div className="grid place-content-start">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell({ row }) {
      return <div className="text-start">{getTaskId(row.getValue("id"))}</div>;
    },
    size: 20,
  },
  {
    id: "label",
    accessorKey: "label",
    header: () => <span className="">{"Label"}</span>,
    cell({ row }) {
      return (
        <span className="border p-1 rounded-md">{row.getValue("label")}</span>
      );
    },
  },
  {
    id: "title",
    accessorKey: "title",
    header: () => <div className="">{"Title"}</div>,
    cell({ row }) {
      return <div className="">{row.getValue("title")}</div>;
    },
    size: 300,
    minSize:200,
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: () => <div className="">{"Priority"}</div>,
    cell({ row }) {
      return (
        <div className="flex gap-4">
          {row.getValue("priority") === "LOW" ? (
            <MoveUp strokeWidth={1} />
          ) : row.getValue("priority") === "MEDIUM" ? (
            <MoveUp strokeWidth={1}  className="rotate-90" />
          ) : (
            <MoveUp strokeWidth={1} className="rotate-180" />
          )}
          {toCapitalCase(row.getValue("priority"))}
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => <div className="">{"Status"}</div>,
    cell({ row }) {
      return <div className="">{toCapitalCase(row.getValue("status"))}</div>;
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <TableAction task={task} />
      );
    },
    size: 10,
  },
];
