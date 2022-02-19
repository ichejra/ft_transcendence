import { FiUsers, FiSettings } from "react-icons/fi";
import { RiUserStarFill } from "react-icons/ri";
import { IoLogoGameControllerB } from "react-icons/io";
import { GiPingPongBat } from "react-icons/gi";
import { useEffect, useRef, useState } from "react";

const Dashboard: React.FC = () => {
  const [showAction, setShowAction] = useState(false);
  const ulRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    console.dir(ulRef.current?.children);
  }, [showAction]);
  return (
    <div className="page-100 flex justify-center lg:p-12">
      <div className="flex flex-col items-center p-8 w-full border-2 shadow-xl rounded-3xl bg-gray-200 space-y-6">
        <div className="flex justify-between w-full text-xl">
          <div className="flex items-center justify-between border-2 border-yellow-400 text-yellow-400 rounded-xl bg-white py-8 px-8">
            <FiUsers size="4rem" className="mr-4" />
            <div>
              <span className="text-5xl font-mono font-bold">55</span>
              <p>Total users</p>
            </div>
          </div>
          <div className="flex items-center border-2 border-green-400 text-green-400 rounded-xl bg-white py-8 px-8">
            <RiUserStarFill size="4rem" className="mr-4" />
            <div className="">
              <span className="text-5xl font-mono font-bold">32</span>
              <p>Active users</p>
            </div>
          </div>
          <div className="flex items-center border-2 border-red-400 text-red-400 rounded-xl bg-white py-8 px-8">
            <IoLogoGameControllerB size="4rem" className="mr-4 " />
            <div className="">
              <span className="text-5xl font-mono font-bold">12</span>
              <p>Total Games</p>
            </div>
          </div>
          <div className="flex items-center border-2 border-blue-400 text-blue-400 rounded-xl bg-white py-8 px-8">
            <GiPingPongBat size="4rem" className="mr-4" />
            <div className="">
              <span className="text-5xl font-mono font-bold">3</span>
              <p>Active Games</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full text-xl">
          <h1 className="text-gray-800 font-bold text-2xl">Users list :</h1>
          <ul className="font-mono text-gray-800" ref={ulRef}>
            {Array.from({ length: 15 }).map((user, index) => {
              return (
                <li
                  key={index}
                  className="flex flex-col bg-white border rounded-lg py-2 px-6 my-1"
                >
                  <div className="flex justify-between items-center">
                    <p>{index + 1}</p>
                    <div className="flex items-center">
                      <img
                        src="/images/profile.jpeg"
                        className="w-16 h-16 rounded-full mr-3"
                      />
                      <p>username</p>
                    </div>
                    <p>19/02/2022</p>
                    <p>user</p>
                    <p className="text-green-400">active</p>
                    <div className="flex items-center">
                      <FiSettings
                        size="1.8rem"
                        className="mr-2 text-yellow-400 cursor-pointer hover:text-yellow-600 transition duration-300"
                        onClick={() => setShowAction(!showAction)}
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      !showAction && "hidden"
                    } flex justify-end w-full m-2 text-white font-sans font-bold`}
                  >
                    <button className="hover:bg-blue-600 transition duration-300 bg-blue-400 rounded-md mr-2 p-2 w-20">
                      Info
                    </button>
                    <button className="hover:bg-red-600 transition duration-300 bg-red-400 rounded-md mr-2 p-2 w-20">
                      Delete
                    </button>
                    <button className="hover:bg-yellow-600  transition duration-300 bg-yellow-400 rounded-md mr-2 p-2 w-20">
                      Ban
                    </button>
                    <select className="hover:bg-green-600 transition duration-300 bg-green-400 rounded-md mr-2 p-2">
                      <option value="0">Role</option>
                      <option value="0">User</option>
                      <option value="0">Admin</option>
                      <option value="0">Owner</option>
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
