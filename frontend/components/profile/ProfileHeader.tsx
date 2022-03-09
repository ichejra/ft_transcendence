import { FaUserFriends } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import EditProfileModal from "../modals/EditProfileModal";
import {
  editUserProfile,
  fetchAllUsers,
  User,
} from "../../features/userProfileSlice";
import { useParams } from "react-router";
import Button from "../utils/Button";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  fetchPendingStatus,
  fetchRequestStatus,
} from "../../features/friendsManagmentSlice";

interface Props {
  user: User;
  users: User[];
  friends: User[];
}

const ProfileHeader: React.FC<Props> = ({ user, users, friends }) => {
  //! useState
  const [isPending, setIsPending] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [userProfile, setUserProfile] = useState(user);

  //! useParams
  const { id: profileID } = useParams();

  //! useAppDispatch
  const dispatch = useAppDispatch();

  //! useAppSelector
  const { editProfile } = useAppSelector((state) => state.user);

  const addFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchRequestStatus(id.toString()));
      dispatch(fetchPendingStatus());
      setIsPending(true);
    }
  };

  //TODO setup the unfriend user function
  const removeFriend = () => {
    console.log("Friend removed");
  };

  const editMyProfile = () => {
    dispatch(editUserProfile(true));
    console.log("profile updated");
  };

  useEffect(() => {
    setUserProfile((userprofile) => {
      userprofile = users.find((user) => user.id === Number(profileID)) || user;
      return userprofile;
    });

    setIsFriend((state) => {
      state =
        friends.find((user) => user.id === Number(profileID)) === undefined
          ? false
          : true;
      return state;
    });
  }, [profileID]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchAllUsers());
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center md:my-16 my-10">
      <div className="md:mx-8 mb-2 md:mb-0">
        <img
          src={userProfile?.avatar_url}
          className="bg-gray-300 w-36 h-36 md:h-56 md:w-56 rounded-full"
        />
      </div>
      <div className="flex flex-col items-center md:items-start md:justify-center px-4 md:mr-48 mb-2 md:mb-0">
        <h1 className="text-xl font-mono md:text-2xl font-bold">
          {userProfile?.display_name}
        </h1>
        <p className="text-gray-400 lowercase text-lg font-mono">
          @{userProfile?.user_name}
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
        {user.id !== Number(profileID) ? (
          <div className="mt-2 text-gray-800 flex">
            {!isFriend && !isPending && (
              <Button
                func={() => addFriend(userProfile.id)}
                type={"adduser"}
                color="yellow-400"
              />
            )}
            {isFriend && (
              <Button func={removeFriend} type="remove" color="gray-200" />
            )}
          </div>
        ) : (
          <Button func={editMyProfile} type="edit" color="yellow-400" />
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
