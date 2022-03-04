import React from "react";
import { FaUserEdit, FaUserTimes } from "react-icons/fa";
import { HiUserAdd, HiUserRemove } from "react-icons/hi";

interface Props {
  func: () => void;
  type: string;
  color: string;
}

const Button: React.FC<Props> = ({ func, type, color }) => {
  return (
    <button
      onClick={func}
      className={`hover:scale-110 transition duration-300 cursor-pointer flex items-center text-md md:text-lg md:mx-4 py-1 md:py-2 px-6 bg-${color} text-gray-800 rounded-md`}
    >
      {type === "accept" && <HiUserAdd className="w-6 h-8 mr-2" />}
      {type === "accept" && "Accept"}
      {type === "reject" && <FaUserTimes className="w-6 h-8 mr-2" />}
      {type === "reject" && "Reject"}
      {type === "adduser" && <HiUserAdd className="w-6 h-8 mr-2" />}
      {type === "adduser" && "Add Friend"}
      {type === "remove" && <HiUserRemove className="w-6 h-8 mr-2" />}
      {type === "remove" && "Unfriend"}
      {type === "edit" && <FaUserEdit className="w-6 h-8 mr-2" />}
      {type === "edit" && "Edit Profile"}
    </button>
  );
};

export default Button;
