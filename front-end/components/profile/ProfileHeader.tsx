import Link from "next/link";
import { FaUserEdit, FaUserFriends } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

const ProfileHeader: React.FC = () => {
  return (
    <div className="flex my-16">
      <div className="mx-8">
        <img
          src="/images/profile.jpeg"
          className="bg-gray-300 h-56 w-56 rounded-full"
        />
      </div>
      <div className="flex flex-col justify-center px-4 mr-48">
        <h1 className="text-3xl font-bold">John Doe</h1>
        <span className="flex text-gray-500 pt-4 mb-2 items-center">
          <FaUserFriends className="w-6 h-8 mr-2" />
          <p className="text-lg font-medium">555 friends</p>
        </span>
        <span className="flex text-gray-500 items-center">
          <IoMdTime className="w-6 h-8 mr-2" />
          <p className="text-lg font-medium">Joined Junuary, 2022</p>
        </span>
      </div>
      <div className="flex items-start mt-10">
        <Link href="/profile/edit">
          <button className="hover:scale-110 transition duration-300 cursor-pointer flex items-center text-lg font-medium mx-4 py-2 px-4 bg-yellow-400 text-gray-800 rounded-md">
            <FaUserEdit className="w-6 h-8 mr-2" />
            Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileHeader;
