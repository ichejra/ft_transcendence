import Link from "next/link";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import UsersModal from "./UsersModal";

const FriendsList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="w-1/4 pb-12 ">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold p-2">Friends</h1>
        <Link href="/profile/1/list">
          <div className="cursor-pointer flex items-center font-bold text-gray-600 hover:text-yellow-400 transition duration-300">
            See All
            <AiOutlineRight />
          </div>
        </Link>
        {openModal && <UsersModal setOpenModal={setOpenModal} />}
      </div>
      <div className="border rounded-lg p-4 shadow-md">
        {Array.from({ length: 100 })
          .slice(0, 15)
          .map((test, index) => {
            return (
              <Link href={`/profile/${index}`}>
                <div className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-lg transition duration-300">
                  <img
                    src="/images/profile.jpeg"
                    className="bg-gray-300 h-14 w-14 rounded-full"
                  />
                  <div className="flex flex-col justify-center pl-4 capitalize ">
                    <h4 className="font-bold text-lg">firstName lastname</h4>
                    <p className="text-gray-400 font-small text-sm font-sans">
                      @FistLast
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default FriendsList;
