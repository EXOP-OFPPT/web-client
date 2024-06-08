import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import Delete from "./Delete";
import Update from "./Update";
import Verify from "./Verify";
import { TaskType } from "@/state/Tasks/GetSlice";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Timestamp } from "firebase/firestore";
import { store } from "@/state/store";
import { UserInterface } from "@/state/Auth/AuthSlice";


export const columns: ColumnDef<TaskType>[] = [

  // {
  //   id: "id",
  //   accessorKey: "id",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Id
  //         <ChevronsUpDown size={12} className="ml-2" />
  //       </Button>
  //     );
  //   },
  // },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "probleme",
    accessorKey: "probleme",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Probleme
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let bgColor;
      if (row.original.status === 'todo') {
        bgColor = 'bg-neutral-400';
      } else if (row.original.status === 'inprogress') {
        bgColor = 'bg-yellow-500';
      } else if (row.original.status === 'done') {
        bgColor = 'bg-success';
      }
      return (
        <Badge variant="outline" className={`w-20 font-bold flex justify-center items-center py-2 px-4 ${bgColor} hover:${bgColor}`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </Badge>
      )
    }
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let createdAt;
      if (row.original.createdAt instanceof Date) {
        createdAt = row.original.createdAt;
      } else if (typeof row.original.createdAt === 'string') {
        createdAt = new Date(row.original.createdAt);
      } else {
        createdAt = new Date();
      }

      const date = createdAt.toLocaleDateString();

      return <span>{date}</span>;
    },
  },
  {
    id: "deadLine",
    accessorKey: "deadLine",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dead Line
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let createdAt;
      if (row.original.createdAt instanceof Timestamp) {
        createdAt = row.original.createdAt.toDate();
      } else if (typeof row.original.createdAt === 'string') {
        createdAt = new Date(row.original.createdAt);
      } else {
        createdAt = new Date();
      }

      let deadline;
      if (row.original.deadLine instanceof Timestamp) {
        deadline = row.original.deadLine.toDate();
      } else if (typeof row.original.deadLine === 'string') {
        deadline = new Date(row.original.deadLine);
      } else {
        deadline = new Date();
      }

      const today = new Date();

      // Ensure the dates are valid
      if (isNaN(createdAt.getTime()) || isNaN(deadline.getTime())) {
        console.error('Invalid date values');
        return null;
      }

      const totalDuration = deadline.getTime() - createdAt.getTime();
      const elapsedDuration = today.getTime() - createdAt.getTime();

      // Ensure the total duration is not zero
      if (totalDuration === 0) {
        console.error('Total duration is zero');
        return null;
      }

      const progress = Math.min(100, (elapsedDuration / totalDuration) * 100);
      const date = deadline.toLocaleDateString();

      return (
        <Card className="border-neutral-700">
          <div className="text-center bg-neutral-4000 w-full h-3 p-[1.5px]">
            <div className={`bg-blue-500 !bg-primary h-full flex justify-center items-center rounded-full`} style={{ width: `${progress}%` }}>
            </div>
            <span className="text-[13px]">{date}</span>
          </div>
        </Card>
      );
    },
  },
  {
    id: "assignedTo",
    accessorKey: "assignedTo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assigned To
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "Verification",
    accessorKey: "Verification",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Verification
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <Verify info={row.original} />
        </>
      );
    }
  },
  {
    id: "action",
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const user = store.getState().auth.user as UserInterface;
      if (user.role == "admin") {
        return (
          <div className="flex justify-center items-center gap-2">
            <Update mode="outline" info={row.original} />
            <Delete mode="outline" docId={row.original.id} kpiCode={row.original.kpiCode} />
          </div>
        );
      } else if (user.email == row.original.assignedTo) {
        return (
          <div className="flex justify-center items-center gap-2">
            <Update mode="outline" info={row.original} />
          </div>
        );
      }
    }
  },
  // {
  //   id: "kpiCode",
  //   accessorKey: "kpiCode",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Kpi Code
  //         <ChevronsUpDown size={12} className="ml-2" />
  //       </Button>
  //     );
  //   },
  // },

];
