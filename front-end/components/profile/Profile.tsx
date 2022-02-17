import { ProfileHeader, ProfileInfo, FriendsList } from ".";

const UserProfile: React.FC = () => {
  return (
    <div className="page-100 flex justify-center lg:py-12">
      <div className="flex flex-col w-full lg:w-5/6 items-center border-2 shadow-xl rounded-3xl bg-white">
        <ProfileHeader />
        <hr className="w-5/6 h-4" />
        <div className="flex flex-col lg:flex-row justify-center w-full">
          <ProfileInfo />
          <FriendsList />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
