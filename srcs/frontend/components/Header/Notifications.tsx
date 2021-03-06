import { useEffect } from "react";
import { BsPersonCheck } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchNoRelationUsers,
  fetchUserFriends,
  showNotificationsList,
  setIsFriend,
} from "../../features/userProfileSlice";
import Cookies from "js-cookie";
import { socket } from "../../pages/SocketProvider";
import {
  fetchPendingStatus,
  acceptFriendRequest,
  removeFriendRelation,
} from "../../features/friendsManagmentSlice";
import { useParams } from "react-router";

const Notifications = () => {
  const dispatch = useAppDispatch();
  const { pendingUsers, pendingReq } = useAppSelector((state) => state.friends);
  const { users } = useAppSelector((state) => state.user);
  const acceptFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(acceptFriendRequest(id)).then(() => {
        dispatch(fetchUserFriends()).then(() => {
          dispatch(setIsFriend(true));
        });
        dispatch(fetchPendingStatus()).then(() => {
          dispatch(fetchNoRelationUsers());
          socket.emit("send_notification", { userId: id });
        });
      });
    }
    dispatch(showNotificationsList(false));
  };

  const rejectFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(removeFriendRelation(id)).then(() => {
        dispatch(fetchNoRelationUsers());
        dispatch(fetchPendingStatus());
        socket.emit("send_notification", { userId: id });
      });
    }
    dispatch(showNotificationsList(false));
  };

  //? re-render the component each time a friend get accepted or rejected to update the pending users
  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchPendingStatus());
    }
  }, [pendingReq]);

  return (
    <ul className="user-card-bg about-family tracking-wider rounded-xl p-2">
      {pendingUsers.length > 0 ? (
        <p className="text-sm flex justify-end m-1">Notifcations</p>
      ) : (
        <p className="text-sm flex justify-end m-1">No Notifcations</p>
      )}

      {pendingUsers.map((user) => {
        const { id, display_name, avatar_url } = user;
        return (
          <li key={id}>
            <div className="flex m-1 p-2 border border-gray-500 rounded-lg items-center justify-between">
              <div className="flex mr-2">
                <img
                  src={avatar_url}
                  alt={display_name}
                  className="w-16 h-16 rounded-full mr-2"
                />
                <div>
                  <p className={`text-md txt-cyan`}>Friend Request</p>
                  <p className={`font-light text-sm text-gray-400`}>
                    <span className="font-bold text-md text-white">
                      {display_name}
                    </span>{" "}
                    sent you a friend request.
                  </p>
                </div>
              </div>
              <div className="flex">
                <BsPersonCheck
                  onClick={() => acceptFriend(id)}
                  className="hover:bg-cyan-500 transition duration-300 cursor-pointer mx-1 p-1 w-8 h-8 bg-cyan text-gray-800 rounded-full"
                >
                  accept
                </BsPersonCheck>
                <FaTimes
                  onClick={() => rejectFriend(id)}
                  className="hover:bg-gray-100 transition duration-300 cursor-pointer mx-1 p-1 w-8 h-8 bg-gray-200 text-gray-800 rounded-full"
                >
                  reject
                </FaTimes>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Notifications;
