import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileHeader, ProfileInfo, FriendsList } from ".";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCurrentUser,
  fetchSingleUser,
  fetchUserFriends,
  setIsPageLoading,
} from "../../features/userProfileSlice";

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loggedUser, user, friends, editProfile, completeInfo } =
    useAppSelector((state) => state.user);
  const { id } = useParams();

  useEffect(() => {
    if (editProfile === false && Number(id) === loggedUser.id) {
      console.log("4. Profile updated");
      dispatch(fetchUserFriends());
    }
    if (Number(id) === loggedUser.id) {
      dispatch(setIsPageLoading(true));
      dispatch(fetchCurrentUser()).then(() =>
        dispatch(setIsPageLoading(false))
      );
    }
  }, [editProfile, completeInfo]);

  useEffect(() => {
    if (!user.user_name && Number(id) !== loggedUser.id) {
      dispatch(setIsPageLoading(true));
      dispatch(fetchSingleUser(Number(id))).then(() =>
        dispatch(setIsPageLoading(false))
      );
    }
  }, [id]);

  return (
    <div className="page-100 mt-20 flex justify-center bg-black">
      <div className="flex flex-col w-full 2xl:w-[80rem] items-center shadow-xl rounded-none lg:rounded-xl">
        <ProfileHeader
          user_me={Number(id) === loggedUser.id ? loggedUser : user}
          users={users}
          friends={friends}
        />
        <div className="w-full mt-4">
          <ProfileInfo
            user_me={Number(id) === loggedUser.id ? loggedUser : user}
            users={users}
          />
          {loggedUser.id === Number(id) && <FriendsList friends={friends} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

//TODO add blocked users list
//TODO add unblock button to blocked users in blokeduserslist
//TODO fix profile buttons state