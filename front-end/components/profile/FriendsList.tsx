import Link from "next/link";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { UsersModal } from ".";

const FriendsList: React.FC = () => {
  const [confirmationModal, setConfirmationModal] = useState(false);

  return (
    <div className="lg:w-1/4 pb-12 ">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold p-2">Friends</h1>
        <Link href="/profile/1/list">
          <div className="cursor-pointer flex items-center font-bold text-gray-600 hover:text-yellow-400 transition duration-300">
            See All
            <AiOutlineRight />
          </div>
        </Link>
        {confirmationModal && (
          <UsersModal setConfirmationModal={setConfirmationModal} />
        )}
      </div>
      <div className="border rounded-lg p-4 shadow-md">
        {Array.from({ length: 50 })
          .slice(0, 15)
          .map((user, index) => {
            const id = new Date().getTime().toString() + index;
            return (
              <Link key={id} href={`/profile/${id}`}>
                <div className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-lg transition duration-300">
                  <img
                    src="/images/profile.jpeg"
                    className="bg-gray-300 h-14 w-14 rounded-full bg-contain"
                  />
                  <div className="flex flex-col justify-center pl-4 capitalize ">
                    <h4 className="font-bold text-lg">Fname Lname</h4>
                    <p className="text-gray-400 font-small text-sm font-sans">
                      @flname
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
