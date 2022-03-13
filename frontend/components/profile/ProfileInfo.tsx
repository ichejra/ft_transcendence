import { AiOutlineRight } from "react-icons/ai";
import { useState } from "react";
import HistoryModal from "../modals/HistoryModal";
import { useAppSelector } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { User } from "../../features/userProfileSlice";

interface Props {
  user_me: User;
}

const ProfileInfo: React.FC<Props> = ({ user_me }) => {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const { id } = useParams();
  // return (
  //   <div
  //     className={`${user.id !== Number(id) ? "w-3/4" : "lg:mr-12 lg:w-2/4"} pb-12`}
  //   >
  //     <div className="flex justify-between mr-2 lg:mr-0">
  //       <h1 className="text-xl font-bold p-2">Game history</h1>
  //       <button
  //         onClick={() => setOpenModal(true)}
  //         className="flex items-center font-bold text-gray-600 hover:text-yellow-400 transition duration-300"
  //       >
  //         See All
  //         <AiOutlineRight />
  //       </button>
  //       {openModal && <HistoryModal setOpenModal={setOpenModal} />}
  //     </div>
  //     <div className="border rounded-lg p-4 shadow-md">
  //       {Array.from({ length: 100 })
  //         .slice(0, 4)
  //         .map((test, index) => {
  //           return (
  //             <div
  //               key={index}
  //               className="flex justify-between items-center p-2"
  //             >
  //               <div className="flex items-center justify-between  w-1/2 lg:w-2/5 bg-green-300 rounded-l-full lg:rounded-full pr-4">
  //                 <img
  //                   src="/images/profile.jpeg"
  //                   className="w-14 h-14 rounded-full"
  //                 />
  //                 <h1 className="lg:text-xl font-bold py-2 px-2 lg:px-4 text-green-800">
  //                   Jdoe
  //                 </h1>
  //                 <p>10</p>
  //               </div>
  //               <span className="hidden lg:block text-yellow-400 text-2xl font-bold">
  //                 VS
  //               </span>
  //               <div className="flex items-center justify-between w-1/2 lg:w-2/5 bg-red-300 rounded-r-full lg:rounded-full pl-4">
  //                 <p>7</p>
  //                 <h1 className="lg:text-xl font-bold py-2 lg:px-4 px-2 text-red-800">
  //                   Sdave
  //                 </h1>
  //                 <img
  //                   src="/images/profile.jpeg"
  //                   className="w-14 h-14 rounded-full"
  //                 />
  //               </div>
  //             </div>
  //           );
  //         })}
  //     </div>
  //   </div>
  // );
  return (
    <div className="md:relative left-[24rem] xl:left-[28rem] md:w-[22rem] lg:w-[24rem] xl:w-[28rem]">
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
        {openModal && <HistoryModal setOpenModal={setOpenModal} />}
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
                      src={user_me.avatar_url}
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full"
                    />
                    <h1 className="about-family text-[14px] mt-1">
                      {user_me.user_name}
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
