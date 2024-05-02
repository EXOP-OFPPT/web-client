import React from "react";
import { Camera } from "lucide-react";
import { Card } from "../ui/card";

type AvatarProps = {
  avatar: string;
};

const Avatar: React.FC<AvatarProps> = ({ avatar }) => {
  return (
    <Card className="rounded-lg shadow-lg p-10">
      <div className="font-bold pb-7 uppercase">Image de profile</div>
      <div className="flex flex-col items-center px-7 ">
        <img
          src={avatar}
          alt="user"
          className="w-30 h-30 mb-3 rounded-full shadow-lg"
        />
      </div>
      <div className="flex justify-center">
        <button className="flex font-semibold capitalize text-blue-500">
          <Camera className="h-6 w-6" />
          changer l'image de profile
        </button>
      </div>
    </Card>
  );
};

export default Avatar;
