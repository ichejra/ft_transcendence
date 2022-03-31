import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileHeader, ProfileInfo, FriendsList } from ".";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCurrentUser,
  fetchUserFriends,
} from "../../features/userProfileSlice";

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, user, friends, editProfile, completeInfo } = useAppSelector(
    (state) => state.user
  );
  const [userProfile, setUserProfile] = useState(user);
  const { id } = useParams();

  useEffect(() => {
    if (editProfile === false) {
      console.log("4. Profile updated");
      dispatch(fetchUserFriends());
    }
    dispatch(fetchCurrentUser());
  }, [editProfile, completeInfo]);

  useEffect(() => {
    if (Number(id) === user.id) {
      setUserProfile(user);
    }
  }, [user]);

  useEffect(() => {
    console.log(8);
    setUserProfile(() => {
      let newUserprofile = users.find((newUser) => newUser.id === Number(id));
      return newUserprofile !== undefined ? newUserprofile : user;
    });
    console.log("%cRENDER PROFILE", "color:green; font-weight: bold");
  }, [id]);

  return (
    <div className="page-100 mt-20 flex justify-center bg-black">
      <div className="flex flex-col w-full 2xl:w-[80rem] items-center shadow-xl rounded-none lg:rounded-xl">
        <ProfileHeader user_me={userProfile} users={users} friends={friends} />
        <div className="w-full mt-4">
          <ProfileInfo user_me={userProfile} users={users} />
          {/* <div className='w-96 h-80 bg-yellow-400'></div> */}
          {user.id === Number(id) && <FriendsList friends={friends} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
