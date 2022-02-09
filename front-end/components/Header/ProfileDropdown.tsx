import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { HiOutlineLogout } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import Notifications from "./Notifications";

const ProfileDropdown = () => {
  const [dropDown, setDropdown] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const [isNotification, setIsNotification] = useState(false);
  const [showNotificationsList, setShowNotificationsList] = useState(false);
  const dropDownRef = useRef<any>(null);
  const notifRef = useRef<any>(null);

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
        showNotificationsList &&
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setShowNotificationsList(false);
      }
    };
    document.addEventListener("mousedown", updateDropDownStatus);
    return () => {
      document.removeEventListener("mousedown", updateDropDownStatus);
    };
  }, [dropDown, showNotificationsList]);
  return (
    <div className="flex">
      {!isUser ? (
        <div className="flex py-3 items-center transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <button className="hover:scale-110 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-1 px-4 bg-white text-black rounded-md">
            <Link href="/auth">Login</Link>
          </button>
        </div>
      ) : (
        <div className="dropdown flex items-center transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          {/******************************************************************************/}
          <div ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotificationsList(!showNotificationsList)}
              className="nav-container mr-4"
            >
              {!isNotification ? (
                <IoMdNotifications size="2rem" />
              ) : (
                <IoMdNotificationsOutline size="2rem" />
              )}
              <div className="amount-notif-container">
                <p className="total-amount">6</p>
              </div>
            </button>
            {/****************************/}
            {showNotificationsList && (
              <div
                className={`${
                  showNotificationsList
                    ? "show-dropdown-menu"
                    : "hide-dropdown-menu"
                } notifications-list`}
              >
                <Notifications />
              </div>
            )}
          </div>
          {/******************************************************************************/}
          <div ref={dropDownRef}>
            <button
              type="button"
              onClick={() => setDropdown(!dropDown)}
              className="flex items-center px-2 "
            >
              <p className="mr-4 text-xl hover:text-yellow-400 transition duration-300">
                elahyani
              </p>
              <img
                src="/images/profile.jpeg"
                className="bg-gray-300 h-12 w-12 rounded-full"
              />
            </button>
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
                  <Link href={`/profile/${1}`}>
                    <span className="flex items-center pr-16">
                      <CgProfile size="1.5rem" />
                      <p className="ml-3">Profile</p>
                    </span>
                  </Link>
                </li>
                <li className="py-2 pl-2 hover:bg-gray-800 hover:text-yellow-400 transition duration-300">
                  <Link href="/profile/edit">
                    <span className="flex items-center">
                      <FiSettings size="1.5rem" />
                      <p className="ml-3">Settings</p>
                    </span>
                  </Link>
                </li>
                <li>
                  <hr />
                </li>
                <li className="py-2 pl-2 rounded-b-xl hover:bg-gray-800 hover:text-yellow-400 transition duration-300">
                  <Link href="/auth">
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
