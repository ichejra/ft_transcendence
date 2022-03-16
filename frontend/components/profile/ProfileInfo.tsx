import { AiOutlineRight } from "react-icons/ai";
import { useState, useEffect } from "react";
import HistoryModal from "../modals/HistoryModal";
import { useAppSelector } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { User } from "../../features/userProfileSlice";

interface Props {
  user_me: User;
  users: User[];
}

const ProfileInfo: React.FC<Props> = ({ user_me, users }) => {
  const [openModal, setOpenModal] = useState(false);
  const [userProfile, setUserProfile] = useState(user_me);

  const { id: profileID } = useParams();

  useEffect(() => {
    console.log(6);
    setUserProfile((userprofile) => {
      let newUserprofile = users.find((user) => user.id === Number(profileID));
      userprofile = newUserprofile !== undefined ? newUserprofile : user_me;
      return userprofile;
    });
  }, [profileID]);

  return (
    <div className="md:relative left-[26rem] xl:left-[30rem] md:w-[22rem] lg:w-[24rem] xl:w-[28rem]">
      <div className="flex justify-between mr-2">
        <h1 className="about-family text-xl py-2 px-4 text-white text-opacity-80">
          Game history
        </h1>
        <button
          onClick={() => setOpenModal(true)}
          className="about-family flex items-center mr-3 text-sm text-gray-500 header-item transition duration-300"
        >
          See All
          <AiOutlineRight />
        </button>
        {openModal && (
          <HistoryModal user={userProfile} setOpenModal={setOpenModal} />
        )}
      </div>
      <hr className="h-[1px] border-0 mx-4 bg-gray-700" />
      <div className="text-white text-opacity-80">
        {Array.from({ length: 100 })
          .slice(0, 4)
          .map((test, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-3 md:px-4"
              >
                <div className="flex items-center space-x-10">
                  <div className="flex flex-col items-center">
                    <img
                      src={userProfile.avatar_url}
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full"
                    />
                    <h1 className="about-family text-[14px] mt-1">
                      {userProfile.user_name}
                    </h1>
                  </div>
                </div>
                <span className="flex  md:text-xl font-bold space-x-2">
                  <p className="about-family">10</p>
                  <span>-</span>
                  <p className="about-family">7</p>
                </span>
                <div className="flex items-center space-x-10">
                  <div className="flex flex-col items-center">
                    <img
                      src="/images/profile.jpeg"
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full"
                    />
                    <h1 className="about-family text-[14px] mt-1">SalvaDor</h1>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProfileInfo;
