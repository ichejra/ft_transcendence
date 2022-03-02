import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

const AllUsers = () => {
  const [isFriend, setIsFriend] = useState(false);
  const {
    users,
    user: { id: userID },
  } = useAppSelector((state) => state.user);

  const sendFriendReq = () => {};

  return (
    <div className="page-100 flex justify-center md:py-12">
      <div className="md:w-5/6 items-center md:border-2 shadow-xl rounded-3xl bg-white">
        <div className="flex flex-col py-4">
          <h1 className="ml-4 md:ml-20 p-2 text-2xl text-gray-800 font-bold">
            All Players
          </h1>
          <div className="flex flex-wrap justify-center">
            {users
              .filter((user) => user.id !== userID)
              .map((user) => {
                const { id, avatar_url, display_name, user_name } = user;
                return (
                  <div
                    key={id}
                    className="p-4 shadow-md md:m-2 w-5/6 my-1 md:w-auto rounded-xl border capitalize flex md:flex-col items-center justify-between"
                  >
                    <div className="flex md:flex-col items-center">
                      <img
                        src={avatar_url}
                        className="w-16 h-16 rounded-full mr-2 md:mr-0 md:mb-4 md:w-36 md:h-36"
                      />
                      <div className="flex flex-col md:items-center items-start justify-center">
                        <h1 className="text-md md:font-bold md:text-lg mr-2 md:mr-0">
                          {display_name}
                        </h1>
                        <p className="text-sm md:text-md text-gray-500 font-sans">
                          @{user_name}
                        </p>
                      </div>
                    </div>
                    {isFriend ? (
                      <div className="mt-2 text-gray-800 flex">
                        <button
                          // onClick={() => setConfirmationModal(true)}
                          className="hover:bg-gray-100 bg-gray-200 mr-2 px-2 py-1 rounded-md font-bold transition duration-300"
                        >
                          unfriend
                        </button>
                        <Link to={`/profile/${id}`}>
                          <button className="hover:bg-yellow-300 bg-yellow-400 mr-2 px-2 py-1 rounded-md font-bold transition duration-300">
                            profile
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-2 text-gray-800 flex">
                        <button
                          onClick={sendFriendReq}
                          className="hover:bg-yellow-300 bg-yellow-400 px-2 py-1 rounded-md font-bold transition duration-300"
                        >
                          Add Friend
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
