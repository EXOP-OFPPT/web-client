import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronsUpDown } from "lucide-react";
import Delete from "./Delete";
import Update from "./Update";
import { EventType } from "@/state/Events/GetSlice";
import { Timestamp } from "firebase/firestore";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "../ui/badge";
import { store } from "@/state/store";
import { UserInterface } from "@/state/Auth/AuthSlice";


export const columns: ColumnDef<EventType>[] = [
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
    id: "startedAt",
    accessorKey: "startedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Started At
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

      let startedAt;
      if (row.original.startedAt instanceof Timestamp) {
        startedAt = row.original.startedAt.toDate();
      } else if (typeof row.original.startedAt === 'string') {
        startedAt = new Date(row.original.startedAt);
      } else {
        startedAt = new Date();
      }

      const today = new Date();

      // Ensure the dates are valid
      if (isNaN(createdAt.getTime()) || isNaN(startedAt.getTime())) {
        console.error('Invalid date values');
        return null;
      }

      const totalDuration = startedAt.getTime() - createdAt.getTime();
      const elapsedDuration = today.getTime() - createdAt.getTime();

      // Ensure the total duration is not zero
      if (totalDuration === 0) {
        console.error('Total duration is zero');
        return null;
      }

      const progress = Math.min(100, (elapsedDuration / totalDuration) * 100);
      const date = startedAt.toLocaleDateString();

      return (
        <Card className="border-neutral-700">
          <div className="text-center bg-neutral-4000 w-full h-3 p-[1.5px]">
            <div className={`!bg-blue-500 !bg-primary h-full flex justify-center items-center rounded-full`} style={{ width: `${progress}%` }}>
            </div>
            <span className="text-[13px]">{date}</span>
          </div>
        </Card>
      );
    },
  },
  {
    id: "locationType",
    accessorKey: "locationType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location Type
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          {row.original.location.type.charAt(0).toUpperCase() + row.original.location.type.slice(1)}
        </>
      )
    }
  },
  {
    id: "locationAddress",
    accessorKey: "locationAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location Address
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          {row.original.location.address}
        </>
      )
    }
  },
  {
    id: "guests",
    accessorKey: "guests",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Guests
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Badge variant="outline" className="flex items-center gap-1">
                <DropdownMenuLabel>Guests</DropdownMenuLabel>
                <ChevronDownIcon size={12} />
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                row.original.guests.map((guest, index) =>
                  <DropdownMenuItem key={index}>
                    <div className="w-full h-full flex justify-start items-center gap-2">
                      <Avatar className="w-6 h-6 my-2 flex items-center justify-center cursor-pointer">
                        <AvatarImage loading="lazy" src={guest.avatar} className="object-cover" />
                        <AvatarFallback className="text-[9px]">
                          {guest.firstName?.charAt(0).toUpperCase()}
                          {guest.lastName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{guest.email}</span>
                    </div>
                  </DropdownMenuItem>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>

        </>
      )
    }
  },
  {
    id: "action",
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const user = store.getState().auth.user as UserInterface;
      if (user?.role == "admin") {
        return (
          <div onClick={(e) => e.stopPropagation()} className="flex justify-center items-center gap-2">
            <Update mode="outline" info={row.original} />
            <Delete mode="outline" docId={row.original.id} />
          </div>
        );
      }
    },
  },
];
