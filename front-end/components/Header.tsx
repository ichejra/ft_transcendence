import Link from "next/link";

const Header: React.FC = () => {
  return (
    <div className="p-6 bg-black shadow-2xl shadow-black/60 text-white flex items-center justify-around">
      <div className="cursor-pointer text-2xl font-bold">
        <Link href="/">LOGO</Link>
      </div>
      <ul className="flex justify-between w-1/3">
        <li className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/">HOME</Link>
        </li>
        <li className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/about">ABOUT</Link>
        </li>
        <li className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/dashboard">DASHBOARD</Link>
        </li>
      </ul>
      <div>
        <button className="hover:scale-125 transition duration-300 cursor-pointer text-2xl font-medium mx-2 px-2">
          <Link href="/game">PLAY</Link>
        </button>
        <button className="hover:scale-110 transition duration-300 cursor-pointer text-2xl font-medium mx-2 py-1 px-4 bg-white text-black rounded-md">
          <Link href="/auth">LOGOUT</Link>
        </button>
      </div>
    </div>
  );
};

export default Header;
