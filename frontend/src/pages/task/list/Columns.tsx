import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTaskId, toCapitalCase } from "@/lib/utils";
import { TaskType } from "@/types/task";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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
    maxSize: 10,
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
    maxSize: 10,
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
    maxSize: 40,
  },
  {
    id: "title",
    accessorKey: "title",
    header: () => <div className="">{"Title"}</div>,
    cell({ row }) {
      return <div className="">{row.getValue("title")}</div>;
    },
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: () => <div className="">{"Priority"}</div>,
    cell({ row }) {
      return <div className="">{toCapitalCase(row.getValue("priority"))}</div>;
    },
    maxSize: 100,
    size: 100,
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => <div className="">{"Status"}</div>,
    cell({ row }) {
      return <div className="">{toCapitalCase(row.getValue("status"))}</div>;
    },
    maxSize: 100,
    size: 100,
  },
  {
    id: "action",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(getTaskId(task.id))}
            >
              Copy Task ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
