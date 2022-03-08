import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import UsersModal from "../modals/ConfirmationModal";
import { useAppSelector } from "../../app/hooks";
import { FaUsersSlash } from "react-icons/fa";

const FriendsList: React.FC = () => {
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { friends } = useAppSelector((state) => state.user);
  return (
    <div className="lg:w-1/4 pb-12 ">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold p-2">Friends</h1>
        <Link to="/profile/1/list">
          <div className="cursor-pointer flex items-center font-bold text-gray-600 hover:text-yellow-400 transition duration-300">
            See All
            <AiOutlineRight />
          </div>
        </Link>
        {confirmationModal && (
          <UsersModal setConfirmationModal={setConfirmationModal} />
        )}
      </div>
      {!friends.length ? (
        <div className="border rounded-lg p-4 shadow-md h-80">
          <div className="flex h-full justify-center items-center">
            <FaUsersSlash className="w-20 h-20 text-gray-200" />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 shadow-md h-80">
          {friends.map((friend) => {
            const { id, avatar_url, display_name, user_name } = friend;
            return (
              <Link key={id} to={`/profile/${id}`}>
                <div className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-lg transition duration-300">
                  <img
                    src={avatar_url}
                    className="bg-gray-300 h-14 w-14 rounded-full bg-contain"
                  />
                  <div className="flex flex-col justify-center pl-4 capitalize ">
                    <h4 className="font-bold text-lg">{display_name}</h4>
                    <p className="text-gray-400 font-small text-sm font-sans">
                      @{user_name}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendsList;

/* .map((user, index) => {
 */
