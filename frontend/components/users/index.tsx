import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { FaUsersSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import { socket } from "../../pages/SocketProvider";
import {
  fetchNoRelationUsers,
  fetchAllUsers,
} from "../../features/userProfileSlice";
import {
  fetchRequestStatus,
  fetchPendingStatus,
} from "../../features/friendsManagmentSlice";

const AllUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    nrusers: users,
    user: { id: userID },
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchNoRelationUsers());
      dispatch(fetchAllUsers());
    }
  }, []);

  if (users.length < 1) {
    return (
      <div className="page-100 flex justify-center md:py-12">
        <div className="md:w-5/6 items-center md:border-2 shadow-xl rounded-3xl bg-white">
          <div className="flex h-full justify-center items-center">
            <FaUsersSlash className="w-48 h-48 text-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-100 flex justify-center md:py-12">
      <div className="md:w-5/6 items-center md:border-2 shadow-xl rounded-3xl bg-white">
        <div className="flex flex-col py-4">
          <div className="flex flex-wrap justify-center">
            {users
              .filter((user) => user.id !== userID)
              .map((user) => {
                return <User key={user.id} {...user} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  id: number;
  avatar_url: string;
  display_name: string;
  user_name: string;
}

const User: React.FC<Props> = ({ id, avatar_url, display_name, user_name }) => {
  const dispatch = useAppDispatch();

  const { pendingUsers } = useAppSelector((state) => state.friends);

  const sendFriendRequest = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchRequestStatus(id.toString()));
      dispatch(fetchPendingStatus());
      socket.emit("refresh", {});
    }
  };

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchNoRelationUsers());
    }
  }, [pendingUsers]);

  return (
    <div
      key={id}
      className="p-4 shadow-md md:m-2 w-5/6 my-1 md:w-52 rounded-xl border capitalize flex md:flex-col items-center justify-between"
    >
      <div className="flex md:flex-col items-center">
        <img
          src={avatar_url}
          className="w-16 h-16 rounded-full mr-2 md:mr-0 md:mb-4 md:w-36 md:h-36"
        />
        <div className="flex flex-col md:items-center items-start justify-center">
          <h1 className="text-md md:font-bold md:text-lg mr-2 md:mr-0 text-center">
            {display_name}
          </h1>
          <p className="text-sm md:text-md text-gray-500 font-sans">
            @{user_name}
          </p>
        </div>
      </div>

      <div className="mt-2 text-gray-800 flex w-5/6 justify-center">
        <div className="w-full text-center">
          <div className="hover:bg-gray-100 bg-gray-200 px-2 py-1 w-full mb-2 rounded-md font-bold transition duration-300">
            <Link to={`/profile/${id}`}>View Profile</Link>
          </div>
          <button
            onClick={() => sendFriendRequest(id)}
            className="hover:bg-yellow-300 bg-yellow-400 px-2 py-1 w-full rounded-md font-bold transition duration-300"
          >
            Add Friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
