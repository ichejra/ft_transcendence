import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UsersModal } from "../../../components/profile";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../../../state/reducers";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../../state";

const FullFriendsList: NextPage = () => {
  const [confirmationModal, setConfirmationModal] = useState(false);
  const dispatch = useDispatch();
  const { getUsers } = bindActionCreators(actionCreators, dispatch);
  const { users, isLoading } = useSelector(
    (state: State) => state.usersReducer
  );

  useEffect(() => {
    getUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div className="page-100 flex justify-center md:py-12">
      <div className="md:w-5/6 items-center md:border-2 shadow-xl rounded-3xl bg-white">
        <div className="flex flex-col py-4">
          <h1 className="ml-4 md:ml-20 p-2 text-2xl text-gray-800 font-bold">
            All Friends
          </h1>
          <div className="flex flex-wrap justify-center">
            {users.map((user) => {
              console.log(user);
              const { id, firstName, lastName, picture } = user;
              return (
                <div
                  key={id}
                  className="p-4 shadow-md md:m-2 w-5/6 my-1 md:w-auto rounded-xl border capitalize flex md:flex-col items-center justify-between"
                >
                  <div className="flex md:flex-col">
                    <img
                      src={picture}
                      className="w-16 h-16 rounded-full mr-2 md:mr-0 md:mb-4 md:w-36 md:h-36"
                    />
                    <div className="flex flex-col md:items-center items-start justify-center">
                      <h1 className="text-md md:font-bold md:text-lg mr-2 md:mr-0">
                        {firstName} {lastName}
                      </h1>
                      <p className="text-sm md:text-md text-gray-500 font-sans">
                        @{firstName[0] + lastName}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-gray-800 flex">
                    <button
                      onClick={() => setConfirmationModal(true)}
                      className="hover:bg-gray-100 bg-gray-200 mr-2 px-2 py-1 rounded-md font-bold transition duration-300"
                    >
                      unfriend
                    </button>
                    <Link href={`/profile/${id}`}>
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
      {confirmationModal && (
        <UsersModal setConfirmationModal={setConfirmationModal} />
      )}
    </div>
  );
};

export default FullFriendsList;
