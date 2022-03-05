import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProfileHeader, ProfileInfo, FriendsList } from ".";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUserFriends } from "../../features/userProfileSlice";

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, user, friends } = useAppSelector((state) => state.user);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchUserFriends());
  }, []);

  return (
    <div className="page-100 flex justify-center lg:py-12">
      <div className="flex flex-col w-full lg:w-5/6 items-center border-2 shadow-xl rounded-3xl bg-white">
        <ProfileHeader user={user} users={users} friends={friends} />
        <hr className="w-5/6 h-4" />
        <div className="flex flex-col lg:flex-row justify-center w-full">
          <ProfileInfo />
          {user.id === Number(id) && <FriendsList friends={friends} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
