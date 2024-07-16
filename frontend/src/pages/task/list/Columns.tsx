import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { statuses } from "@/components/data-table/DataTableToolbar";
import TableAction from "@/components/data-table/TableAction";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getTaskId, toCapitalCase } from "@/lib/utils";
import { TaskTableList } from "@/types/task";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TaskTableList>[] = [
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
    size:20,
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"id"} />,
    cell({ row }) {
      return <div className="text-start whitespace-nowrap">{getTaskId(row.getValue("id"))}</div>;
    },
    size:30,
  },
  {
    id: "label",
    accessorKey: "label",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Label"} />,
    cell({ row }) {
      return <Badge className="border p-1 rounded-md">{row.getValue("label")}</Badge>;
    },
    size:30,
  },
  {
    id:"project",
    accessorKey:"project",
    header:({ column }) => <DataTableColumnHeader column={column} title={"Project"} />,
    cell({row}){
      return <span className="whitespace-nowrap">{(row.getValue('project') as any).name}</span>
    }
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Title"} />,
    cell({ row }) {
      return <div className="whitespace-nowrap">{row.getValue("title")}</div>;
    },
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Priority"} />,
    cell({ row }) {
      return (
        <div className="flex gap-2 items-center">
          {row.getValue("priority") === "LOW" ? (
            <ArrowUpIcon strokeWidth={1} className="rotate-180" />
          ) : row.getValue("priority") === "MEDIUM" ? (
            <ArrowUpIcon strokeWidth={1} className="rotate-90" />
          ) : (
            <ArrowUpIcon strokeWidth={1} />
          )}
          {toCapitalCase(row.getValue("priority"))}
        </div>
      );
    },
    enableResizing: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const task = row.original;
      return <TableAction task={task} />;
    },
    size:20,
  },
];
