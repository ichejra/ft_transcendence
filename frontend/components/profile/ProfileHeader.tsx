import { Link } from "react-router-dom";
import { FaUserEdit, FaUserFriends } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { HiUserAdd, HiUserRemove } from "react-icons/hi";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import EditProfileModal from "../modals/EditProfileModal";
import { editUserProfile } from "../../features/userProfileSlice";

const ProfileHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    user: { avatar_url, user_name, display_name },
    friends,
    editProfile,
  } = useAppSelector((state) => state.user);

  return (
    <div className="flex flex-col md:flex-row items-center md:my-16 my-10">
      <div className="md:mx-8 mb-2 md:mb-0">
        <img
          src={avatar_url}
          className="bg-gray-300 w-36 h-36 md:h-56 md:w-56 rounded-full"
        />
      </div>
      <div className="flex flex-col items-center md:items-start md:justify-center px-4 md:mr-48 mb-2 md:mb-0">
        <h1 className="text-xl font-mono md:text-2xl font-bold">
          {display_name}
        </h1>
        <p className="text-gray-400 lowercase text-lg font-mono">
          @{user_name}
        </p>
        <span className="hidden md:flex text-gray-500 pt-4 mb-2 items-center">
          <FaUserFriends className="w-6 h-8 mr-2" />
          <p className="text-lg font-medium">{friends.length} friends</p>
        </span>
        <span className="hidden md:flex text-gray-500 items-center">
          <IoMdTime className="w-6 h-8 mr-2" />
          <p className="text-lg font-medium">Joined Junuary, 2022</p>
        </span>
      </div>
      <div className="flex md:items-start md:mt-10">
        {1 ? (
          <div className="mt-2 text-gray-800 flex">
            {0 ? (
              <button
                // onClick={() => setConfirmationModal(true)}
                className="hover:scale-110 transition duration-300 cursor-pointer flex items-center text-md md:text-lg md:mx-4 py-1 md:py-2 px-6 bg-yellow-400 text-gray-800 rounded-md"
              >
                <HiUserAdd className="w-6 h-8 mr-2" />
                Add Friend
              </button>
            ) : (
              <button
                // onClick={() => setConfirmationModal(true)}
                className="hover:scale-110 transition duration-300 cursor-pointer flex items-center text-md md:text-lg md:mx-4 py-1 md:py-2 px-6 bg-gray-200 text-gray-800 rounded-md"
              >
                <HiUserRemove className="w-6 h-8 mr-2" />
                unfriend
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => dispatch(editUserProfile(true))}
            className="hover:scale-110 transition duration-300 cursor-pointer flex items-center text-md md:text-lg md:mx-4 py-1 md:py-2 px-6 bg-yellow-400 text-gray-800 rounded-md"
          >
            <FaUserEdit className="w-6 h-8 mr-2" />
            Edit Profile
          </button>
        )}
      </div>
      {editProfile && <EditProfileModal />}
    </div>
  );
};

export default ProfileHeader;

/* 
send request => 
  - sender: status pending:  sent msg
  - reciever: status pending: accept msg
accept request => 
  - sender: status accepted: unfriend msg
  - reciever: status accepted: unfriend msg
*/
