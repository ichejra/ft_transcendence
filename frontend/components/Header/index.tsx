import { Link } from "react-router-dom";
import { GoThreeBars } from "react-icons/go";
import Sidebar from "./Sidebar";
import ProfileDropdown from "./ProfileDropdown";
import { openSidebar } from "../../features/sidebarSlice";
import { useAppDispatch } from "../../app/hooks";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <nav className="className='font-mono pl-6 py-4 bg-black bg-opacity-75 shadow-md shadow-black/10 text-white flex items-center justify-between">
        <button
          className="nav-toggle"
          onClick={() => {
            dispatch(openSidebar());
          }}
        >
          <GoThreeBars size="3rem" className="text-yellow-400" />
        </button>
        <div className="nav-links cursor-pointer text-2xl text-yellow-500 font-bold">
          <Link to="/">LOGO</Link>
        </div>
        <ul className="nav-links flex md:justify-between w-1/2 2xl:w-1/3">
          <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
            <Link to="/channels">Channels</Link>
          </li>
          <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
            <Link to="/game">Game</Link>
          </li>
          <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
            <Link to="/users">Users</Link>
          </li>
          <li className="hover:scale-110 hover:text-yellow-400 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
            <Link to="/about">about</Link>
          </li>
        </ul>
        <ProfileDropdown />
      </nav>
      <Sidebar />
    </>
  );
};

export default Header;
