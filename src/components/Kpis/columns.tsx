import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import Delete from "./Delete";
import Update from "./Update";
import Cookies from "universal-cookie";
import { KpiType } from "@/state/Kpis/GetSlice";
import AddTask from "../Tasks/Create";
import { Card } from "../ui/card";
const cookie = new Cookies(null, { path: "/" });


export const columns: ColumnDef<KpiType>[] = [
  // {
  //   id: "code",
  //   accessorKey: "code",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Code
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
    id: "description",
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "minTaux",
    accessorKey: "minTaux",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Min Taux
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "currentTaux",
    accessorKey: "currentTaux",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Current Taux
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "progress",
    accessorKey: "progress",
    header: () => {
      return (
        <Button variant="ghost">
          Progress
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const minKpi = row.original.minTaux; // replace with your actual min KPI
      const currentKpi = row.original.currentTaux; // replace with your actual current KPI
      const progress = Number(Math.min(100, (currentKpi / minKpi) * 100).toFixed(2));
      // Calculate hue from progress. 120 is green in HSL, 0 is red.
      const hue = progress * 1.2;

      return (
        <Card className="border-neutral-700">
          <div className="text-center bg-neutral-4000 w-full h-3 p-[1.5px]">
            <div
              className={`h-full flex justify-center items-center rounded-full`}
              style={{
                width: `${progress}%`,
                backgroundColor: `hsl(${hue}, 100%, 50%)`
              }}
            >
            </div>
            <span className="text-[13px]">{progress}%</span>
          </div>
        </Card>
      );
    },
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span>
          {row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
        </span>
      )
    }
  },
  {
    id: "result",
    accessorKey: "result",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Result
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let value;
      if (row.original.currentTaux < row.original.minTaux && row.original.type == "eliminated") {
        value = "E";
      } else if (row.original.currentTaux < row.original.minTaux && row.original.type == "normal") {
        value = "D";
      } else if (row.original.currentTaux >= row.original.minTaux) {
        value = "C";
      } else {
        value = "N/A";
      }

      return (
        <Button
          className={`${value == "C" ? "bg-primary hover:bg-primary" : value == "D" ? "bg-neutral-500 hover:bg-neutral-500" : "bg-error hover:bg-error"} cursor-default`}
          onClick={() => console.log(row.original.code)}>
          {value}
        </Button>
      )
    }
  },
  // {
  //   id: "improve",
  //   accessorKey: "improve",
  //   header: "Improve",
  //   cell: ({ row }) => {
  //     if (cookie.get("user").role == "admin") {

  //       return (
  //         <Button onClick={() => console.log(row.original.code)}>
  //           Improve
  //         </Button>
  //       )
  //     }
  //   }
  // },
  {
    id: "action",
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      if (cookie.get("user").role == "admin") {
        return (
          <div onClick={(e) => e.stopPropagation()} className="flex justify-center items-center gap-2">
            <AddTask from="global" mode="outline" kpiCode={row.original.code} />
            <Update mode="outline" info={row.original} />
            <Delete mode="outline" docId={row.original.code} />
          </div>
        );
      }
    },
  },
];
