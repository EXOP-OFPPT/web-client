import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { EmployeeType } from "@/state/Employees/GetSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


export default function FancyMultipleSelect({ employees, onSelectionChange, defaultSelectedEmails }: { employees: EmployeeType[], onSelectionChange: (selected: EmployeeType[]) => void, defaultSelectedEmails: string[] }) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<EmployeeType[]>(
        employees.filter((employee) => defaultSelectedEmails.includes(employee.email))
    );
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = React.useCallback((employee: EmployeeType) => {
        setSelected((prev) => {
            return prev.filter((s) => s.email !== employee.email);
        });
    }, []);

    React.useEffect(() => {
        onSelectionChange(selected);
    }, [selected, onSelectionChange]);

    const handleSelect = (employee: EmployeeType) => {
        setSelected((prev) => [...prev, employee]);
    };

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    if (input.value === "") {
                        setSelected((prev) => {
                            const newSelected = [...prev];
                            newSelected.pop();
                            return newSelected;
                        });
                    }
                }
                if (e.key === "Escape") {
                    input.blur();
                }
            }
        },
        []
    );

    const selectables = employees.filter(
        (employee) => !selected.includes(employee)
    );

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selected.map((employee) => {
                        return (
                            <Badge key={employee.email} variant="secondary">
                                <Avatar className="w-6 h-6 my-2 flex items-center justify-center cursor-pointer">
                                    <AvatarImage loading="lazy" src={employee.avatar?.photoURL} className="object-cover" />
                                    <AvatarFallback className="text-[9px]">
                                        {employee.firstName?.charAt(0).toUpperCase()}
                                        {employee.lastName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {/* <span>{employee.email}</span> */}
                                <button
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(employee);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(employee)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select guests employees..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((employee) => {
                                    return (
                                        <CommandItem
                                            key={employee.email}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onSelect={() => {
                                                setInputValue("");
                                                handleSelect(employee);
                                            }}
                                            className={"cursor-pointer"}
                                        >
                                            <div className="w-full h-full flex justify-start items-center gap-2">
                                                <Avatar className="w-6 h-6 my-2 flex items-center justify-center cursor-pointer">
                                                    <AvatarImage loading="lazy" src={employee.avatar?.photoURL} className="object-cover" />
                                                    <AvatarFallback className="text-[9px]">
                                                        {employee.firstName?.charAt(0).toUpperCase()}
                                                        {employee.lastName?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{employee.email}</span>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}