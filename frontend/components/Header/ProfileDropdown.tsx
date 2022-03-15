import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import { HiOutlineLogout } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import Notifications from "./Notifications";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logOutUser } from "../../features/userProfileSlice";
import Cookies from "js-cookie";
import {
  editUserProfile,
  fetchCurrentUser,
  showNotificationsList,
} from "../../features/userProfileSlice";
import { fetchPendingStatus } from "../../features/friendsManagmentSlice";
// import { socket } from "../../pages/SocketProvider";

//TODO hide dropdown menu

const ProfileDropdown = () => {
  const [dropDown, setDropdown] = useState(false);
  const [logout, setLogout] = useState(false);
  const dropDownRef = useRef<any>(null);
  const notifRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { refresh } = useAppSelector((state) => state.globalState);
  const { user, isLoggedIn, showNotifList } = useAppSelector(
    (state) => state.user
  );
  const { pendingUsers, pendingReq } = useAppSelector((state) => state.friends);

  useEffect(() => {
    //* a mousedown event that listen on the dropdown element to hide it when the click is outside it
    const updateDropDownStatus = (e: Event) => {
      if (
        dropDown &&
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target)
      ) {
        setDropdown(false);
      } else if (
        showNotifList &&
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        dispatch(showNotificationsList(false));
      }
    };
    document.addEventListener("mousedown", updateDropDownStatus);
    return () => {
      document.removeEventListener("mousedown", updateDropDownStatus);
    };
  }, [dropDown, showNotifList]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchCurrentUser());
    }
  }, []);

  useEffect(() => {
    console.log(1);
    if (logout) {
      dispatch(logOutUser());
    }
  }, [logout]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchPendingStatus());
    }
  }, []);

  // useEffect(() => {
  //   if (Cookies.get("accessToken")) {
  //     console.log("OK SOCKET TRIGGERED");
  //     dispatch(fetchPendingStatus());
  //   }
  // }, [refresh]);

  return (
    <div className="flex">
      {!isLoggedIn || false ? (
        <div className="flex py-1 items-center transition duration-300 cursor-pointer text-xl font-medium mx-2 px-2">
          {/* <button className="hover:scale-110 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-1 px-4 bg-yellow-400 text-gray-800 rounded-md about-family"> */}
          <button className="hover:scale-110 transition duration-300 login-button">
            <Link to="/auth">Login</Link>
          </button>
        </div>
      ) : (
        <div className="dropdown flex items-center transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2 z-10">
          {isLoggedIn && (
            <div ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  dispatch(showNotificationsList(!showNotifList));
                }}
                className="nav-container mr-4"
              >
                {pendingUsers.length > 0 &&
                pendingUsers.filter((puser) => puser.id !== user.id) ? (
                  <IoMdNotifications size="2rem" className="txt-cyan" />
                ) : (
                  <IoMdNotificationsOutline size="2rem" />
                )}
                {pendingUsers.length > 0 && (
                  <div className="amount-notif-container">
                    <p className="total-amount">{pendingUsers.length}</p>
                  </div>
                )}
              </button>

              {showNotifList && (
                <div
                  className={`${
                    showNotifList ? "show-dropdown-menu" : "hide-dropdown-menu"
                  } notifications-list`}
                >
                  <Notifications />
                </div>
              )}
            </div>
          )}
          <div ref={dropDownRef}>
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setDropdown(!dropDown)}
                className="flex items-center px-2 "
              >
                <p className="hidden md:block mr-4 text-sm header-item transition duration-300 about-title-family">
                  {user.user_name}
                </p>
                <img
                  src={user.avatar_url}
                  className="bg-gray-300 h-12 w-12 rounded-full"
                />
              </button>
            )}
            <div
              className={`${
                dropDown ? "show-dropdown-menu" : "hide-dropdown-menu"
              } dropdown-menu`}
            >
              <ul
                onClick={() => setDropdown(false)}
                className="bg-black rounded-xl bg-opacity-75 py-2"
              >
                <li className="py-2 pl-2 rounded-t-xl hover:bg-gray-800 hover:text-yellow-400 transition duration-300">
                  <Link to={`/profile/${user.id}`}>
                    <span className="flex items-center pr-16">
                      <CgProfile size="1.5rem" />
                      <p className="ml-3">Profile</p>
                    </span>
                  </Link>
                </li>
                <li className="py-2 pl-2 hover:bg-gray-800 hover:text-yellow-400 transition duration-300">
                  <button
                    onClick={() => {
                      navigate(`/profile/${user.id}`);
                      dispatch(editUserProfile(true));
                    }}
                  >
                    <span className="flex items-center">
                      <FiSettings size="1.5rem" />
                      <p className="ml-3">Settings</p>
                    </span>
                  </button>
                </li>
                <li>
                  <hr />
                </li>
                <li className="pt-2 pl-2 rounded-b-xl hover:bg-gray-800 hover:text-yellow-400 transition duration-300">
                  <Link to="/" onClick={() => setLogout(true)}>
                    <span className="flex items-center">
                      <HiOutlineLogout size="1.5rem" />
                      <p className="ml-3">Log Out</p>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
