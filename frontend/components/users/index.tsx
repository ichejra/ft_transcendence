import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import GlobalUsers from "./globaleUsers";

import { FaUsers, FaUsersSlash } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { Link } from "react-router-dom";

interface Props {
  type: string;
}

const AllUsers: React.FC<Props> = ({ type }) => {
  const { blockedUsers } = useAppSelector((state) => state.friends);
  const {
    nrusers,
    loggedUser: { id: userID },
    friends,
  } = useAppSelector((state) => state.user);

  return (
    <div className="page-100 relative mt-20 flex justify-center text-gray-200 bg-black">
      <div className="absolute overflow-auto w-full h-full flex 2xl:w-[80rem] about-family">
        <ul className="border-r border-gray-700 sm:w-[24rem] h-full p-2 sm:p-4">
          <li className="">
            <Link to="/users">
              <div
                className={`hover:bg-opacity-40 ${
                  type === "users" && "highlight"
                } hover:scale-105 hover:bg-blue-300 transition duration-300 cursor-pointer m-1 px-4 py-3 flex items-center rounded-lg`}
              >
                <HiOutlineUserGroup size="1.5rem" className="sm:mr-3" />{" "}
                <span className="hidden sm:block">Users</span>
              </div>
            </Link>
          </li>
          <li className="">
            <Link to={`/users/${userID}/friends`}>
              <div
                className={`hover:bg-opacity-40 ${
                  type === "friends" && "highlight"
                } hover:scale-105 hover:bg-blue-300 transition duration-300 cursor-pointer m-1 px-4 py-3 flex items-center rounded-lg`}
              >
                <FaUsers size="1.5rem" className="sm:mr-3" />{" "}
                <span className="hidden sm:block">Friends</span>
              </div>
            </Link>
          </li>
          <li className="">
            <Link to={`/users/${userID}/blocked`}>
              <div
                className={`hover:bg-opacity-40 ${
                  type === "blockedUsers" && "highlight"
                } hover:scale-105 hover:bg-blue-300 transition duration-300 cursor-pointer m-1 px-4 py-3 flex items-center rounded-lg`}
              >
                <FaUsersSlash size="1.5rem" className="sm:mr-3" />{" "}
                <span className="hidden sm:block">Blocked Users</span>
              </div>
            </Link>
          </li>
        </ul>
        <div className="w-full">
          {type === "users" && (
            <GlobalUsers users={nrusers.filter((user) => user.id !== userID)} />
          )}
          {type === "friends" && <GlobalUsers users={friends} type="friends" />}
          {type === "blockedUsers" && (
            <GlobalUsers users={blockedUsers} type="blocked" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
