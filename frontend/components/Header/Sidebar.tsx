import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { closeSidebar } from "../../features/sidebarSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(
    (state) => state.toggleSidebar.isSidebarOpen
  );

  return (
    <aside
      className={`about-title-family z-10 px-2 h-screen py-4 w-full bg-black bg-opacity-80 txt-cyan ${
        isSidebarOpen ? "show-sidebar sidebar" : "sidebar"
      }`}
    >
      <div className="text-2xl ml-4 font-bold">
        <Link to="/">
          <img src="./images/logo-ft-transcendence.png" className="w-24" />
        </Link>
      </div>
      <button
        type="button"
        className="absolute text-white right-3 top-3"
        onClick={() => dispatch(closeSidebar())}
      >
        <FaTimes size="2rem" className="header-item transition duration-300" />
      </button>
      <ul className="flex flex-col mt-10">
        <li>
          <Link to="/">
            <button
              className="rounded-lg text-left w-full hover:bg-gray-600 transition duration-300 cursor-pointer text-lg font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              Home
            </button>
          </Link>
        </li>
        <li>
          <Link to="/channels">
            <button
              className="rounded-lg text-left w-full  hover:bg-gray-600 transition duration-300 cursor-pointer text-lg font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              Channels
            </button>
          </Link>
        </li>
        <li>
          <Link to="/game">
            <button
              className="rounded-lg text-left w-full  hover:bg-gray-600 transition duration-300 cursor-pointer text-lg font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              Game
            </button>
          </Link>
        </li>
        <li>
          <Link to="/users">
            <button
              className="rounded-lg text-left w-full  hover:bg-gray-600 transition duration-300 cursor-pointer text-lg font-medium mx-2 py-4 px-2"
              onClick={() => dispatch(closeSidebar())}
              type="button"
            >
              Users
            </button>
          </Link>
        </li>
        <li>
          <Link to="/about">
            <button
              className="rounded-lg text-left w-full  hover:bg-gray-600 transition duration-300 cursor-pointer text-lg font-medium mx-2 py-4 px-2"
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
