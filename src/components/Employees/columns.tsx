import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EmployeeType } from "@/state/Employees/GetSlice";
import Delete from "./Delete";
import Update from "./Update";

export const columns: ColumnDef<EmployeeType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
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
          <ArrowUpDown className="ml-2 h-4 w-4 scale-[70%]" />
        </Button>
      );
    },
  },
  {
    id: "lastName",
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "action",
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-2">
          <Update mode="icon" info={row.original} />
          <Delete mode="icon" docId={row.original.email} />
        </div>
      );
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
