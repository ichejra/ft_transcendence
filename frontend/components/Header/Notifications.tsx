import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchPendingStatus } from "../../features/friendsManagentSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { showNotificationsList } from "../../features/userProfileSlice";

const Notifications = () => {
  const dispatch = useAppDispatch();
  const { pendingUsers } = useAppSelector((state) => state.friends);
  const {
    user: { id: currentUserID },
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchPendingStatus());
  }, []);

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
          <li
            onClick={() => dispatch(showNotificationsList(false))}
            key={id}
            className="hover:bg-gray-800 rounded-lg transition duration-300 lg:w-96"
          >
            <Link to={`/profile/${id}`}>
              <div className="flex m-1 p-2 hover:border-yellow-400  border rounded-lg items-center">
                <img src={avatar_url} className="w-16 h-16 rounded-full mr-2" />
                <div>
                  <p className={`text-md text-yellow-300`}>Friend Request</p>
                  <p className={`text-base font-light`}>
                    <span className="font-bold font-mono">{display_name}</span>{" "}
                    sent you a friend request.
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Notifications;
