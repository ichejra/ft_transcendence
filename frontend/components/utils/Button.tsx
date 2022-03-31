import React from "react";
import { FaUserEdit } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { MdPersonRemove } from "react-icons/md";
import { useAppSelector } from "../../app/hooks";

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
  const { isLoading } = useAppSelector((state) => state.user);
  return (
    <button
      onClick={() => func(id)}
      className={`hover:scale-105 transition duration-300 w-[214px] h-[37px] rounded-md about-family ${style}`}
    >
      {isLoading ? (
        <div className="loading-2 border border-cyan-200 w-6 h-6"></div>
      ) : (
        <span className="flex items-center justify-center">
          {icon && icons[icon]}
          {type}
        </span>
      )}
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
