import { FaUserFriends } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import EditProfileModal from "../modals/EditProfileModal";
import { editUserProfile, User } from "../../features/userProfileSlice";
import { useParams } from "react-router";
import Button from "../utils/Button";
import { acceptFriendRequest } from "../../features/friendsManagentSlice";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  user: User;
  users: User[];
  friends: User[];
}

const ProfileHeader: React.FC<Props> = ({ user, users, friends }) => {
  const [isPending, setIsPending] = useState(true);
  const [isFriend, setIsFriend] = useState(true);
  const { id: profileID } = useParams();
  const dispatch = useAppDispatch();
  const { pendingUsers, pendingReq, acceptReq } = useAppSelector(
    (state) => state.friends
  );
  const { editProfile } = useAppSelector((state) => state.user);
  const userProfile =
    users.find((user) => user.id === Number(profileID)) || user;

  const addFriend = () => {
    console.log("Friend Added");
  };

  const acceptFriend = (id: number) => {
    const checkFriend = friends.find(
      (friend) => friend.id === Number(profileID)
    );
    dispatch(acceptFriendRequest(id));
    if (checkFriend) {
      setIsFriend(true);
    }
    console.log(
      "Friend " +
        users.find((user) => user.id === id)?.display_name +
        " accepted"
    );
  };

  const rejectFriend = () => {
    console.log("Friend rejected");
  };

  const removeFriend = () => {
    console.log("Friend removed");
  };

  const editMyProfile = () => {
    dispatch(editUserProfile(true));
    console.log("profile updated");
  };
  // TODO fix buttons events and manage them
  // useEffect(() => {
  //   const checkUser = pendingUsers.find(
  //     (friend) => friend.id === Number(profileID)
  //   );
  //   if (checkUser) {
  //     setIsPending(false);
  //   }
  // }, [pendingReq]);

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
            {isPending && (
              <div className="flex">
                <Button
                  funcWithParam={() => acceptFriend(userProfile.id)}
                  type={"accept"}
                  color={"yellow-400"}
                />
                <Button
                  func={rejectFriend}
                  type={"reject"}
                  color={"gray-200"}
                />
              </div>
            )}
            {!isFriend && !isPending && (
              <Button func={addFriend} type={"adduser"} color="yellow-400" />
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
