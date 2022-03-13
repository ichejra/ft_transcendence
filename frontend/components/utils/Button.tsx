import React from "react";
import { FaUserEdit } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { MdPersonRemove } from "react-icons/md";

interface Props {
  func: (id: number) => void;
  type: string;
}

const Button: React.FC<Props> = ({ func, type }) => {
  return (
    <button
      onClick={func}
      className={`hover:scale-105 transition duration-300 w-[214px] h-[37px] flex items-center justify-center rounded-md about-family ${
        type !== "remove" ? "bg-blue txt-cyan" : "bg-blue-400 text-cyan-200"
      }`}
    >
      {type === "adduser" && <HiUserAdd size="1.5rem" className="mr-2" />}
      {type === "adduser" && "Add Friend"}
      {type === "remove" && <MdPersonRemove size="1.5rem" className="mr-2" />}
      {type === "remove" && "Unfriend"}
      {type === "edit" && <FaUserEdit size="1.5rem" className="mr-2" />}
      {type === "edit" && "Edit Profile"}
    </button>
  );
};

export default Button;
