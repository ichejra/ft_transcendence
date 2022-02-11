import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { UsersModal } from "../../../components/profile";

const FriendsList: NextPage = () => {
  const [openModal, setOpenModal] = useState(true);
  return (
    <div className="page-100 flex justify-center py-12">
      <div className="w-5/6 items-center border-2 shadow-xl rounded-3xl bg-white">
        <div className="flex flex-wrap justify-center m-4">
          {Array.from({ length: 50 }).map((test, index) => {
            return (
              <div className="p-4 shadow-md m-2 rounded-xl border capitalize flex flex-col items-center">
                <img
                  src="/images/profile.jpeg"
                  className="w-40 h-40 rounded-full mb-4"
                />
                <h1 className="font-bold text-lg">firstname lastname</h1>
                <p>@firstLast</p>
                <div className="mt-2 text-gray-800">
                  <button className="hover:bg-gray-100 bg-gray-200 mr-2 px-2 py-1 rounded-md font-bold transition duration-300">
                    unfreind
                  </button>
                  <Link href={`/profile/${index + 1}`}>
                    <button className="hover:bg-yellow-300 bg-yellow-400 mr-2 px-2 py-1 rounded-md font-bold transition duration-300">
                      profile
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {openModal && <UsersModal setOpenModal={setOpenModal} />}
    </div>
  );
};

export default FriendsList;
