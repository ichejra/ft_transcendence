import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { UsersModal } from "../../../components/profile";

const FullFriendsList: NextPage = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="page-100 flex justify-center md:py-12">
      <div className="md:w-5/6 items-center md:border-2 shadow-xl rounded-3xl bg-white">
        <div className="flex flex-col py-4">
          <h1 className="ml-4 md:ml-20 p-2 text-2xl text-gray-800 font-bold">
            All Friends
          </h1>
          <div className="flex flex-wrap justify-center">
            {Array.from({ length: 50 }).map((test, index) => {
              return (
                <div className="p-4 shadow-md md:m-2 rounded-xl border capitalize flex md:flex-col items-center">
                  <img
                    src="/images/profile.jpeg"
                    className="w-16 h-16 rounded-full mr-2 md:mr-0 md:mb-4 md:w-36 md:h-36"
                  />
                  <div className="flex flex-col md:items-center justify-center">
                    <h1 className="text-md md:font-bold md:text-lg mr-2 md:mr-0">
                      firstname lastname
                    </h1>
                    <p className="text-sm md:text-md text-gray-500 font-sans">
                      @firstLast
                    </p>
                  </div>
                  <div className="mt-2 text-gray-800 flex">
                    <button
                      onClick={() => setOpenModal(true)}
                      className="hover:bg-gray-100 bg-gray-200 mr-2 px-2 py-1 rounded-md font-bold transition duration-300"
                    >
                      unfriend
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
      </div>
      {openModal && <UsersModal setOpenModal={setOpenModal} />}
    </div>
  );
};

export default FullFriendsList;
