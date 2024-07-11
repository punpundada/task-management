import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { statuses } from "@/components/data-table/DataTableToolbar";
import TableAction from "@/components/TableAction";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getTaskId, toCapitalCase } from "@/lib/utils";
import { TaskType } from "@/types/task";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

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
    enableResizing: true,
    size: 10,
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"id"} />,
    cell({ row }) {
      return <div className="text-start">{getTaskId(row.getValue("id"))}</div>;
    },
    size: 20,
    enableResizing: true,
  },
  {
    id: "label",
    accessorKey: "label",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Label"} />,
    cell({ row }) {
      return <Badge className="border p-1 rounded-md">{row.getValue("label")}</Badge>;
    },
    size:10,
    enableResizing: true,
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Title"} />,
    cell({ row }) {
      return <div className="">{row.getValue("title")}</div>;
    },
    size: 300,
    minSize: 200,
    enableResizing: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Status"} />,
    cell({ row }) {
      const status = statuses.find((status) => status.value === row.getValue("status"));
      if (!status) return null;
      return (
        <div className="flex w-[100px] items-center">
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      );
    },
    enableResizing: true,
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Priority"} />,
    cell({ row }) {
      return (
        <div className="flex gap-2 items-center">
          {row.getValue("priority") === "LOW" ? (
            <ArrowUpIcon strokeWidth={1} />
          ) : row.getValue("priority") === "MEDIUM" ? (
            <ArrowUpIcon strokeWidth={1} className="rotate-90" />
          ) : (
            <ArrowUpIcon strokeWidth={1} className="rotate-180" />
          )}
          {toCapitalCase(row.getValue("priority"))}
        </div>
      );
    },
    enableResizing: true,
  },
  {
    id: "action",
    cell: ({ row }) => {
      const task = row.original;
      return <TableAction task={task} />;
    },
    size: 10,
    enableResizing: true,
  },
];
