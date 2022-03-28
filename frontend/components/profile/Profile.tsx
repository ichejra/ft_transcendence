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
  const {
    users,
    user: user_me,
    friends,
    editProfile,
    completeInfo,
  } = useAppSelector((state) => state.user);
  const [userProfile, setUserProfile] = useState(user_me);
  const { id: profileID } = useParams();

  // const { rejectUser } = useAppSelector((state) => state.friends);
  const { id } = useParams();

  useEffect(() => {
    console.log(4);
    dispatch(fetchUserFriends());
    dispatch(fetchCurrentUser());
  }, [editProfile, completeInfo]);

  useEffect(() => {
    console.log(6);
    setUserProfile((userprofile) => {
      let newUserprofile = users.find((user) => user.id === Number(profileID));
      userprofile = newUserprofile !== undefined ? newUserprofile : user_me;
      return userprofile;
    });
  }, [profileID]);

  if (!userProfile.user_name) {
    return (
      <div className="page-100 mt-20 flex justify-center profile-card-bg-color">
        <div className="loading w-32 h-32"></div>;
      </div>
    );
  }
  return (
    <div className="page-100 mt-20 flex justify-center profile-card-bg-color">
      <div className="flex flex-col w-full 2xl:w-[80rem] items-center shadow-xl rounded-none lg:rounded-xl bg-black">
        <ProfileHeader user_me={userProfile} users={users} friends={friends} />
        <div className="w-full mt-4">
          <ProfileInfo user_me={userProfile} users={users} />
          {/* <div className='w-96 h-80 bg-yellow-400'></div> */}
          {user_me.id === Number(id) && <FriendsList friends={friends} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
