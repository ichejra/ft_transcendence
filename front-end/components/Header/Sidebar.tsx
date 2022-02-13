import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { closeSidebar } from "../../features/sidebarSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(
    (state) => state.toggleSidebar.isSidebarOpen
  );

  return (
    <aside
      className={`px-2 h-screen py-4 w-full bg-black bg-opacity-75 text-yellow-400 ${
        isSidebarOpen ? "show-sidebar sidebar" : "sidebar"
      }`}
    >
      <div className="text-2xl ml-4 mt-4 font-bold text-yellow-500">
        <h1>LOGO</h1>
      </div>
      <button
        type="button"
        className="absolute text-white right-3 top-3"
        onClick={() => dispatch(closeSidebar())}
      >
        <FaTimes
          size="3rem"
          className="hover:text-yellow-400 transition duration-300 "
        />
      </button>
      <ul className="flex flex-col mt-10">
        <li>
          <Link href="/dashboard">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              Dashboard
            </button>
          </Link>
        </li>
        <li>
          <Link href="/">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              Home
            </button>
          </Link>
        </li>
        <li>
          <Link href="/channels">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              Channels
            </button>
          </Link>
        </li>
        <li>
          <Link href="/game">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              Game
            </button>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <button
              className="rounded-lg text-left w-full hover:text-yellow-400 hover:bg-gray-600 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              about
            </button>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
