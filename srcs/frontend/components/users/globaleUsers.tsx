import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { FaUsersSlash } from "react-icons/fa";
import { GoPrimitiveDot } from "react-icons/go";
import Cookies from "js-cookie";
import { socket } from "../../pages/SocketProvider";
import {
  fetchNoRelationUsers,
  fetchAllUsers,
  fetchUserFriends,
  User,
  fetchSingleUser,
} from "../../features/userProfileSlice";
import {
  fetchRequestStatus,
  fetchPendingStatus,
  blockUserRequest,
  fetchBlockedUsers,
  removeFriendRelation,
  unblockUserRequest,
} from "../../features/friendsManagmentSlice";
import { UButton } from "../utils/Button";

interface UsersProps {
  users: User[];
  type?: string;
}

const GlobalUsers: React.FC<UsersProps> = ({ users, type }) => {
  const dispatch = useAppDispatch();
  const {
    loggedUser: { id: userID },
  } = useAppSelector((state) => state.user);
  const { refresh } = useAppSelector((state) => state.globalState);

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
  }, [refresh]);

  if (users.length < 1) {
    return (
      <div className="flex h-full justify-center items-center">
        <FaUsersSlash className="w-32 sm:w-48 h-32 sm:h-48 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-wrap">
        {users
          .filter((user) => user.id !== userID)
          .map((user) => {
            return <User key={user.id} type={type} {...user} />;
          })}
      </div>
    </div>
  );
};

interface UserProps {
  id: number;
  avatar_url: string;
  display_name: string;
  user_name: string;
  type?: string;
  state: string;
}

const User: React.FC<UserProps> = ({
  id,
  avatar_url,
  display_name,
  user_name,
  state,
  type,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      dispatch(unblockUserRequest(id)).then(() => {
        dispatch(fetchBlockedUsers()).then(() => {
          removeFriend(id);
        });
      });
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
      dispatch(blockUserRequest(id)).then(() => {
        dispatch(fetchBlockedUsers()).then(() => {
          dispatch(fetchUserFriends()).then(() => {
            dispatch(fetchNoRelationUsers());
            socket.emit("send_notification", { userId: id });
          });
        });
      });
    }
  };

  const getUserProfile = (id: number) => {
    if (type === "blocked") return;
    if (Cookies.get("accessToken")) {
      dispatch(fetchSingleUser(id)).then((data: any) => {
        const singleUser: User = data.payload;
        navigate(`/profile/${singleUser.id}`);
      });
    }
  };

  return (
    <div className="text-gray-200 flex flex-col border border-gray-700 items-center user-card-bg p-2 m-3 w-[200px] about-family tracking-wide">
      <div className="flex flex-col items-center">
        {type !== "blocked" ? (
          <div className="relative">
            {type === "friends" && (
              <div>
                {state === "online" ? (
                  <GoPrimitiveDot
                    size="1.5rem"
                    className="absolute text-green-400 right-[15px] bottom-[15px]"
                  />
                ) : state === "in_game" ? (
                  <GoPrimitiveDot
                    size="1.5rem"
                    className="absolute text-orange-400 right-[15px] bottom-[15px]"
                  />
                ) : (
                  <GoPrimitiveDot
                    size="1.5rem"
                    className="absolute text-gray-400 right-[15px] bottom-[15px]"
                  />
                )}
              </div>
            )}
            <img
              src={avatar_url}
              alt={display_name}
              className="w-32 h-32 rounded-full p-3"
            />
          </div>
        ) : (
          <img
            src="/images/blank-profile-picture.svg"
            alt={display_name}
            className="w-32 h-32 rounded-full p-3"
          />
        )}
        <div className="flex flex-col items-center">
          <h1
            onClick={() => getUserProfile(id)}
            className="hover:underline cursor-pointer transition duration-300"
          >
            {display_name}
          </h1>

          <p
            onClick={() => getUserProfile(id)}
            className="hover:underline cursor-pointer transition duration-300 text-xs"
          >
            @{user_name}
          </p>
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
        {type !== "blocked" && (
          <UButton
            type="Block"
            func={blockUser}
            id={id}
            style="bg-transparent hover:opacity-80 opacity-60 border-white"
          />
        )}
      </div>
    </div>
  );
};

export default GlobalUsers;
