import { useEffect } from "react";
import { BsPersonCheck } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchNoRelationUsers,
  fetchUserFriends,
  showNotificationsList,
} from "../../features/userProfileSlice";
import Cookies from "js-cookie";
// import { socket } from "../../pages/SocketProvider";
import {
  fetchPendingStatus,
  acceptFriendRequest,
  removeFriendRelation,
} from "../../features/friendsManagmentSlice";

const Notifications = () => {
  const dispatch = useAppDispatch();
  const { pendingUsers, pendingReq } = useAppSelector((state) => state.friends);
  const { users } = useAppSelector((state) => state.user);

  const acceptFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(acceptFriendRequest(id)).then(() => {
        dispatch(fetchUserFriends());
        dispatch(fetchPendingStatus());
        dispatch(fetchNoRelationUsers());
      });
    }
    // socket.emit("refresh", {});
    console.log(
      "Friend " +
        users.find((user) => user.id === id)?.display_name +
        " accepted"
    );
  };

  //TODO add notifications-friends sockets
  const rejectFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(removeFriendRelation(id)).then(() => {
        dispatch(fetchNoRelationUsers());
        dispatch(fetchPendingStatus());
      });
    }
    console.log("Friend rejected");
  };

  //? re-render the component each time a friend get accepted or rejected to update the pending users
  useEffect(() => {
    console.log(2);
    if (Cookies.get("accessToken")) {
      dispatch(fetchPendingStatus());
      // socket.emit("refresh", {});
    }
  }, [pendingReq]);

  console.log("pending users =>>", pendingUsers);

  return (
    <ul className="bg-black rounded-xl bg-opacity-75 p-2">
      {pendingUsers.length > 0 ? (
        <p className="text-sm flex justify-end m-1">Notifcations</p>
      ) : (
        <p className="text-sm flex justify-end m-1">No Notifcations</p>
      )}

      {pendingUsers.map((user) => {
        const { id, display_name, avatar_url } = user;
        return (
          <li onClick={() => dispatch(showNotificationsList(false))} key={id}>
            <div className="flex m-1 p-2 border rounded-lg items-center justify-between">
              <div className="flex mr-2">
                <img src={avatar_url} className="w-16 h-16 rounded-full mr-2" />
                <div>
                  <p className={`text-md txt-cyan`}>Friend Request</p>
                  <p className={`text-base font-light font-sans`}>
                    <span className="font-bold">{display_name}</span> sent you a
                    friend request.
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
