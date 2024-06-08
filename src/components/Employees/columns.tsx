import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { EmployeeType } from "@/state/Employees/GetSlice";
import Delete from "./Delete";
import Update from "./Update";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { store } from "@/state/store";
import { UserInterface } from "@/state/Auth/AuthSlice";

export const columns: ColumnDef<EmployeeType>[] = [

  {
    id: "avatar",
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      return (
        <Avatar className="h-8 w-8 flex items-center justify-center">
          <AvatarImage loading="lazy" src={row.original.avatar?.photoURL} className="object-cover" />
          <AvatarFallback className="text-xs">
            {row.original.firstName?.charAt(0).toUpperCase()}
            {row.original.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "matricule",
    accessorKey: "matricule",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Matricule
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "firstName",
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "lastName",
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: "role",
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ChevronsUpDown size={12} className="ml-2" />
        </Button>
      );
    },
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
            <Delete mode="outline" docId={row.original.email} />
          </div>
        );
      }
    },
  },
  //   {
  //     id: 'phones',
  //     accessorKey: "info.phones",
  //     header: () => <div className="">Phones</div>,
  //     cell: ({ row }) => {
  //       const phones = row.original.info.phones;
  //       return <div>
  //         {Array.isArray(phones) ?
  //           // make number link tel:number
  //           <div className="flex flex-col justify-center items-center gap-2">
  //             <DropdownMenu>
  //               <DropdownMenuTrigger asChild>
  //                 <Button variant="outline">
  //                   <>
  //                     <span className="font-semibold text-primary">
  //                       {phones.length}</span>&nbsp;Phone Numbers<ChevronDown style={{ scale: "0.7" }} />
  //                   </>
  //                 </Button>
  //               </DropdownMenuTrigger>
  //               <DropdownMenuContent className="w-56">
  //                 {phones.map((phone, index) => {
  //                   return (
  //                     <div key={index}>
  //                       <DropdownMenuSeparator />
  //                       <DropdownMenuItem>
  //                         <a href={`tel:${phone}`} className="font-semibold text-primary">
  //                           {phone}
  //                         </a>
  //                       </DropdownMenuItem>
  //                     </div>
  //                   )
  //                 })}
  //               </DropdownMenuContent>
  //             </DropdownMenu>
  //           </div>
  //           : "_ _ _ _"}
  //       </div>
  //     },
  //   },
];
