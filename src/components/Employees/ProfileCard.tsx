import { EmployeeType } from "@/state/Employees/GetSlice";
import { Card } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Update from "./Update";
import Delete from "./Delete";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }
type ProfileCardProps = {
  data: EmployeeType;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ data }) => {
  return (
    <Card className="flex flex-col gap-5 justify-between sm:min-w-36 py-3">
      <div className="flex flex-col items-end px-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Badge className="rounded-md" variant="secondary">
              Actions
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Update mode={"text"} info={data} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Delete mode={"text"} docId={data.email} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* <div className="flex flex-col items-end px-7">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button>
              <EllipsisVerticalIcon
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Edit
                    </a>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block w-full px-4 py-2 text-left text-sm"
                      )}
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div> */}

      <div className="p-4 flex flex-col items-center">
        <img
          src={
            "https://firebasestorage.googleapis.com/v0/b/exop-d02fc.appspot.com/o/EXOP.jpg?alt=media&token=1a450e62-54b9-4792-bc66-852653aac8ed"
          }
          alt={data.firstName}
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
        />
        <div className="text-center">
          <h2 className="text-xl font-bold capitalize ">
            {data.firstName} {data.lastName}
          </h2>
          <Badge
            variant={data.role == "admin" ? "destructive" : "secondary"}
            className="capitalize"
          >
            {data.role}
          </Badge>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-1">
              Finis<div className="text-xl font-bold">{5}</div>
            </div>
            <div className="p-1">
              En cours
              <div className="text-xl font-bold">{2}</div>
            </div>
            <div className="p-1">
              Non-Finis<div className="text-xl font-bold">{1}</div>
            </div>
          </div>

          <div className="mt-5">
            <p className="">Productivite</p>
          </div>
          {/* <div className="mt-4 w-full bg-gray-200 rounded-lg">
            <div
              className="h-2 bg-blue-500 rounded-lg"
              style={{ width: `${data.progress * 10}%` }}
            ></div>
          </div> */}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
