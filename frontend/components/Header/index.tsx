import { Link } from "react-router-dom";
import { GoThreeBars } from "react-icons/go";
import Sidebar from "./Sidebar";
import ProfileDropdown from "./ProfileDropdown";
import { openSidebar } from "../../features/sidebarSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import React from "react";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, completeInfo } = useAppSelector((state) => state.user);

  return (
    <>
      <nav className="fixed z-50 top-0 border-b border-gray-800 left-0 w-full font-mono pl-6 py-4 bg-black  shadow-md shadow-black/10 text-white flex items-center justify-between">
        <button
          className="nav-toggle"
          onClick={() => {
            dispatch(openSidebar());
          }}
        >
          <GoThreeBars
            size="2rem"
            className="txt-cyan hover:scale-110 transition duration-300"
          />
        </button>
        <div className="nav-links cursor-pointer text-2xl text-yellow-500 font-bold">
          <Link to="/">
            <img src="./images/logo-ft-transcendence.png" className="w-28" />
          </Link>
        </div>
        {isLoggedIn && completeInfo && (
          <ul
            className={`items-list nav-links flex md:justify-between w-1/2 md:w-[45rem] xl:w-[50rem] about-title-family`}
          >
            <li className="mx-2">
              <Link to="/">
                <div className="header-item hover:scale-110 transition duration-300 cursor-pointer text-md font-medium px-2">
                  Home
                </div>
              </Link>
            </li>
            <li className="mx-2">
              <Link to={`/channels`}>
                <div className="header-item hover:scale-110 transition duration-300 cursor-pointer text-md font-medium px-2">
                  Channels
                </div>
              </Link>
            </li>
            <li className="mx-2">
              <Link to={`/direct`}>
                <div className="header-item hover:scale-110 transition duration-300 cursor-pointer text-md font-medium px-2">
                  Chat
                </div>
              </Link>
            </li>
            <li className="mx-2">
              <Link to="/game">
                <div className="header-item hover:scale-110 transition duration-300 cursor-pointer text-md font-medium px-2">
                  Game
                </div>
              </Link>
            </li>
            <li className="mx-2">
              <Link to="/users">
                <div className="header-item hover:scale-110 transition duration-300 cursor-pointer text-md font-medium px-2">
                  Users
                </div>
              </Link>
            </li>
            <li className="mx-2">
              <Link to="/liveGames">
                <div className="header-item hover:scale-110 transition duration-300 cursor-pointer text-md font-medium px-2">
                  Live
                </div>
              </Link>
            </li>
          </ul>
        )}
        <ProfileDropdown />
      </nav>
      <Sidebar />
    </>
  );
};

export default Header;
