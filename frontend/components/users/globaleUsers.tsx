import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { FaUsersSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import { socket } from "../../pages/SocketProvider";
import {
  fetchNoRelationUsers,
  fetchAllUsers,
  fetchUserFriends,
  User,
} from "../../features/userProfileSlice";
import {
  fetchRequestStatus,
  fetchPendingStatus,
  blockUserRequest,
  fetchBlockedUsers,
  removeFriendRelation,
} from "../../features/friendsManagmentSlice";
import { UButton } from "../utils/Button";

interface UsersProps {
  users: User[];
  type?: string;
}

const GlobalUsers: React.FC<UsersProps> = ({ users, type }) => {
  const dispatch = useAppDispatch();
  const {
    user: { id: userID },
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      if (type === "friends") {
        dispatch(fetchUserFriends());
      } else if (type === "blocked") {
        dispatch(fetchBlockedUsers());
      } else {
        dispatch(fetchNoRelationUsers());
        dispatch(fetchAllUsers());
      }
    }
  }, []);

  if (users.length < 1) {
    return (
      <div className="page-100 mt-20 flex justify-center user-card-bg">
        <div className="w-full 2xl:w-[80rem] items-center bg-black">
          <div className="flex h-full justify-center items-center">
            <FaUsersSlash className="w-48 h-48 text-gray-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-100 mt-20 flex justify-center user-card-bg">
      <div className="w-full 2xl:w-[80rem] items-center  bg-black">
        <div className="flex flex-col py-4">
          <div className="flex flex-wrap justify-center">
            {users
              .filter((user) => user.id !== userID)
              .map((user) => {
                return <User key={user.id} type={type} {...user} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

//!---------------------------

interface UserProps {
  id: number;
  avatar_url: string;
  display_name: string;
  user_name: string;
  type?: string;
}

const User: React.FC<UserProps> = ({
  id,
  avatar_url,
  display_name,
  user_name,
  type,
}) => {
  const dispatch = useAppDispatch();
  const { pendingUsers } = useAppSelector((state) => state.friends);

  const sendFriendRequest = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchRequestStatus(id.toString())).then(() => {
        dispatch(fetchPendingStatus()).then(() => {
          dispatch(fetchNoRelationUsers());
          socket.emit("send_notification", { userId: id });
        });
      });
    }
  };

  const unblockUser = (id: number) => {
    if (Cookies.get("accessToken")) {
      // dispatch(unblockBlockedUsers(id));
      dispatch(fetchBlockedUsers());
      dispatch(fetchUserFriends());
    }
  };

  const removeFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(removeFriendRelation(id)).then(() => {
        dispatch(fetchUserFriends());
        dispatch(fetchNoRelationUsers());
        socket.emit("send_notification", { userId: id });
      });
    }
  };

  const blockUser = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(blockUserRequest(id))
        .then(() => {
          type !== "friends"
            ? dispatch(fetchNoRelationUsers())
            : dispatch(fetchUserFriends());
        })
        .then(() => {
          dispatch(fetchBlockedUsers());
        });
      // socket.emit("refresh", id);
    }
  };

  // useEffect(() => {
  //   if (Cookies.get("accessToken")) {
  //     dispatch(fetchNoRelationUsers());
  //     dispatch(fetchUserFriends());
  //   }
  // }, []);

  // useEffect(() => {
  //   if (Cookies.get("accessToken")) {
  //     dispatch(fetchBlockedUsers());
  //   }
  // }, []);

  return (
    <div className="text-gray-200 flex flex-col border border-gray-700 items-center user-card-bg p-2 m-3 w-[200px] about-family tracking-wide">
      <div className="flex flex-col items-center">
        <img
          src={avatar_url}
          alt={display_name}
          className="w-32 h-32 rounded-full p-3"
        />
        <div className="flex flex-col items-center">
          <Link to={`/profile/${id}`}>
            <h1 className="hover:underline transition duration-300">
              {display_name}
            </h1>
          </Link>
          <Link to={`/profile/${id}`}>
            <p className="hover:underline transition duration-300 text-xs">
              @{user_name}
            </p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center mt-3">
        {type === "friends" && (
          <UButton
            type="Unfriend"
            func={removeFriend}
            id={id}
            style="text-gray-900  bg-gray-300 hover:bg-white"
          />
        )}
        {type === "blocked" && (
          <UButton
            type="Unblock"
            func={unblockUser}
            id={id}
            style="text-gray-900  bg-gray-300 hover:bg-white"
          />
        )}
        {type === undefined && (
          <UButton
            type="Add Friend"
            func={sendFriendRequest}
            id={id}
            style="text-gray-900  bg-gray-300 hover:bg-white"
          />
        )}
        <UButton
          type="Block"
          func={blockUser}
          id={id}
          style="bg-transparent hover:opacity-80 opacity-60 border-white"
        />
      </div>
    </div>
  );
};

export default GlobalUsers;
