import {
  ProfileHeader,
  ProfileInfo,
  FriendsList,
} from "../../components/profile";

const UserProfile = () => {
  return (
    <div className="page-100 flex flex-col items-center justify-evenly">
      <ProfileHeader />
      <hr className="w-1/2 h-4"/>
      <div className="flex justify-center w-full">
        <ProfileInfo />
        <FriendsList />
      </div>
    </div>
  );
};

export default UserProfile;
