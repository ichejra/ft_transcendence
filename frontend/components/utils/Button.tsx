import React from "react";
import { FaUserEdit } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { MdPersonRemove } from "react-icons/md";

const icons = [
  ,
  <FaUserEdit size="1.5rem" className="mr-2" />,
  <HiUserAdd size="1.5rem" className="mr-2" />,
  <MdPersonRemove size="1.5rem" className="mr-2" />,
];

interface Props {
  type: string;
  style: string;
  id: number;
  func: (id: number) => void;
  icon?: number;
}

const ProfileButton: React.FC<Props> = ({ func, type, id, style, icon }) => {
  return (
    <button
      onClick={() => func(id)}
      className={`hover:scale-105 transition duration-300 w-[214px] h-[37px] flex items-center justify-center rounded-md about-family ${style}`}
    >
      {icon && icons[icon]}
      {type}
    </button>
  );
};

const UsersButton: React.FC<Props> = ({ type, style, id, func }) => {
  return (
    <button
      onClick={() => func(id)}
      className={`${style} transition duration-300 border rounded-md  m-1 p-1 w-[150px] tracking-wider`}
    >
      {type}
    </button>
  );
};

export { ProfileButton as PButton, UsersButton as UButton };
