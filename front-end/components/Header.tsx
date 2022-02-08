import Link from "next/link";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { HiOutlineLogout } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

const Header: React.FC = () => {
  const [dropDown, setDropdown] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const dropDownRef = useRef<any>(null);

  useEffect(() => {
    //* a mousedown event that listen on the dropdown element to hide it when the click is outside it
    const updateDropDownStatus = (e: Event) => {
      if (
        dropDown &&
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target)
      ) {
        setDropdown(false);
        console.log(e.target);
      }
    };
    document.addEventListener("mousedown", updateDropDownStatus);
    return () => {
      document.removeEventListener("mousedown", updateDropDownStatus);
    };
  }, [dropDown]);

  return (
    <nav className="pl-6 py-4 bg-black bg-opacity-75 shadow-md shadow-black/10 text-white flex items-center justify-between">
      <div className="cursor-pointer text-2xl text-yellow-500 font-bold">
        <Link href="/">LOGO</Link>
      </div>
      <ul className="flex justify-between w-1/2">
        <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/channels">Channels</Link>
        </li>
        <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/game">Game</Link>
        </li>
        <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/about">about</Link>
        </li>
      </ul>
      <div className="flex">
        {!isUser ? (
          <div className="flex py-3 items-center transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
            <button className="hover:scale-110 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-1 px-4 bg-white text-black rounded-md">
              <Link href="/auth">Login</Link>
            </button>
          </div>
        ) : (
          <div
            ref={dropDownRef}
            className="dropdown flex items-center transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2"
          >
            <button
              type="button"
              onClick={() => setDropdown(!dropDown)}
              className="flex items-center dropdown-toggle px-2 "
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
              {/* <div className="arrow"></div> */}
              <ul
                onClick={() => setDropdown(false)}
                className="bg-black rounded-xl bg-opacity-75 p-2"
              >
                <li className="py-2 pl-2 rounded-t-xl hover:bg-gray-800 hover:text-yellow-400 transition duration-300">
                  <Link href="/profile">
                    <span className="flex items-center pr-20">
                      <CgProfile size="1.5rem" />
                      <p className="ml-3">Profile</p>
                    </span>
                  </Link>
                </li>
                <li className="py-2 pl-2 hover:bg-gray-800 transition hover:text-yellow-400 duration-300">
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
                <li className="py-2 pl-2 pr-12 rounded-b-xl hover:bg-gray-800 hover:text-yellow-400 transition duration-300">
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
        )}
      </div>
    </nav>
  );
};

export default Header;
