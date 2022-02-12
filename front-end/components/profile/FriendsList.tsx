import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { UsersModal } from ".";
import { actionCreators } from "../../state";
import { State } from "../../state/reducers";

const FriendsList: React.FC = () => {
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
        {users.slice(0, 15).map((user) => {
          const { id, firstName, lastName, picture } = user;
          return (
            <Link key={id} href={`/profile/${id}`}>
              <div className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-lg transition duration-300">
                <img
                  src={picture}
                  className="bg-gray-300 h-14 w-14 rounded-full bg-contain"
                />
                <div className="flex flex-col justify-center pl-4 capitalize ">
                  <h4 className="font-bold text-lg">
                    {firstName} {lastName}
                  </h4>
                  <p className="text-gray-400 font-small text-sm font-sans">
                    @{firstName[0] + lastName}
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
