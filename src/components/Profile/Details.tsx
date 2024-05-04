import React, { useRef } from "react";
import { Card } from "../ui/card";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

type DetailsProps = {};

const Details: React.FC<DetailsProps> = () => {
  const { firstName, lastName, email, phone, role } = cookies.get("user");
  const fields = [
    { value: firstName, editable: true },
    { value: lastName, editable: true },
    { value: email, editable: false },
    { value: phone, editable: true },
    { value: role, editable: true },
  ];
  const inputRefs = Object.keys(fields).map(() =>
    useRef<HTMLInputElement>(null)
  );
  const { toast } = useToast();

  const copyToClipboard = (index: number) => {
    const inputRef = inputRefs[index];
    if (inputRef.current !== null && inputRef.current.value !== "") {
      const inputValue = inputRef.current.value;
      navigator.clipboard.writeText(inputValue);
      toast({
        variant: "default",
        title: "Copied to clipboard",
        description: inputValue,
        className: "text-primary border-2 border-primary text-start",
        icon: <ClipboardCheck size={40} className="mr-2" />,
      });
    }
  };

  return (
    <>
      <Card className="rounded-lg shadow-lg py-10">
        <Toaster />
        <div className="font-bold pb-7 px-7 uppercase">Detail de Profil</div>

        <div className="flex flex-col items-start px-7">
          {fields.map((field, index) => (
            <div key={index} className="relative w-full mb-5">
              <Input
                disabled={!field.editable}
                ref={inputRefs[index]}
                type="text"
                id={`voice-search-${index}`}
                className="text-sm rounded-lg  block w-full p-3 outline-none"
                placeholder="Not available"
                defaultValue={field.value}
              />
              <button
                onClick={() => copyToClipboard(index)}
                type="button"
                className="absolute inset-y-0 end-0 flex items-center pe-3"
              >
                <Clipboard size={17} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default Details;
