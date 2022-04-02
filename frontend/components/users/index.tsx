import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import GlobalUsers from "./globaleUsers";

import { FaUsers, FaUsersSlash } from "react-icons/fa";

const AllUsers: React.FC = () => {
  const [list, setList] = useState(0);
  const { blockedUsers } = useAppSelector((state) => state.friends);
  const {
    nrusers,
    loggedUser: { id: userID },
    friends,
  } = useAppSelector((state) => state.user);

  return (
    <div className="page-100 mt-20 flex justify-center text-gray-200 bg-black">
      <div className="w-full h-full flex 2xl:w-[80rem] about-family">
        <ul className="user-card-bg border-r border-gray-700 w-[24rem] h-full p-4">
          <li
            onClick={() => setList(0)}
            className="hover:bg-opacity-40 hover:scale-105 hover:bg-blue-300 transition duration-300 cursor-pointer m-1 px-4 py-3 flex items-center rounded-lg"
          >
            <FaUsers size="1.5rem" className="mr-3" /> Users
          </li>
          <li
            onClick={() => setList(1)}
            className="hover:bg-opacity-40 hover:scale-105 hover:bg-blue-300 transition duration-300 cursor-pointer m-1 px-4 py-3 flex items-center rounded-lg"
          >
            <FaUsers size="1.5rem" className="mr-3" /> Friends
          </li>
          <li
            onClick={() => setList(2)}
            className="hover:bg-opacity-40 hover:scale-105 hover:bg-blue-300 transition duration-300 cursor-pointer m-1 px-4 py-3 flex items-center rounded-lg"
          >
            <FaUsersSlash size="1.5rem" className="mr-3" /> Blocked Users
          </li>
        </ul>
        <div className="channels-bar-bg w-full">
          {list === 0 && (
            <GlobalUsers users={nrusers.filter((user) => user.id !== userID)} />
          )}
          {list === 1 && <GlobalUsers users={friends} type="friends" />}
          {list === 2 && <GlobalUsers users={blockedUsers} type="blocked" />}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
