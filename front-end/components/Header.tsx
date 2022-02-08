import Link from "next/link";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { HiOutlineLogout } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { useState } from "react";

const Header: React.FC = () => {
  const [dropDown, setDropdown] = useState(false);
  const [isUser, setIsUser] = useState(false);

  return (
    <div className="pl-6 py-2 bg-black shadow-2xl shadow-black/60 text-white flex items-center justify-between">
      <div className="cursor-pointer text-2xl font-bold">
        <Link href="/">LOGO</Link>
      </div>
      <ul className="flex justify-between w-1/2">
        <li className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/channels">Channels</Link>
        </li>
        <li className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/game">Game</Link>
        </li>
        <li className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/about">about</Link>
        </li>
      </ul>
      <div className="flex">
        {isUser ? (
          <div className="flex py-3 items-center transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
            <button className="hover:scale-110 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-1 px-4 bg-white text-black rounded-md">
              <Link href="/auth">Login</Link>
            </button>
          </div>
        ) : (
          <div className="flex items-center transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
            <button
              type="button"
              onClick={() => setDropdown(!dropDown)}
              className="flex items-center dropdown-toggle px-2 hover:bg-gray-800 transition duration-300"
            >
              <p className="mr-4 text-xl">elahyani</p>
              <img
                src="/images/profile.jpeg"
                className="bg-gray-300 h-16 w-16 rounded-full"
              />
            </button>
            <ul
              onMouseLeave={() => setDropdown(false)}
              className={`${
                dropDown ? "show-dropdown-menu" : "hide-dropdown-menu"
              } dropdown-menu shadow-md shadow-black/40`}
            >
              <li className="py-2 pl-2 hover:bg-white hover:text-black transition duration-300 ">
                <Link href="/profile">
                  <span className="flex items-center pr-20">
                    <CgProfile size="1.5rem" />
                    <p className="ml-3">Profile</p>
                  </span>
                </Link>
              </li>
              <li className="flex items-center py-2 pl-2 hover:bg-white hover:text-black transition duration-300">
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
              <li className="flex items-center py-2 pl-2 pr-12 hover:bg-white hover:text-black transition duration-300">
                <Link href="/auth">
                  <span className="flex items-center">
                    <HiOutlineLogout size="1.5rem" />
                    <p className="ml-3">Log Out</p>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
