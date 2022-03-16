import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProfileHeader, ProfileInfo, FriendsList } from ".";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUserFriends } from "../../features/userProfileSlice";

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, user, friends, editProfile } = useAppSelector(
    (state) => state.user
  );
  const { rejectUser } = useAppSelector((state) => state.friends);

  const { id } = useParams();

  useEffect(() => {
    console.log(4);
    dispatch(fetchUserFriends());
  }, [editProfile]);

  return (
    <div className="page-100 mt-20 flex justify-center profile-card-bg-color">
      <div className="flex flex-col w-full 2xl:w-[80rem] items-center shadow-xl rounded-none lg:rounded-xl bg-black">
        <ProfileHeader user_me={user} users={users} friends={friends} />
        <div className="w-full mt-4">
          <ProfileInfo user_me={user} users={users} />
          {/* <div className='w-96 h-80 bg-yellow-400'></div> */}
          {user.id === Number(id) && <FriendsList friends={friends} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
