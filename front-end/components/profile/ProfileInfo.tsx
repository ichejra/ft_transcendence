import { AiOutlineRight } from "react-icons/ai";
import { useState } from "react";
import HistoryModal from "./HistoryModal";

const ProfileInfo: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="mr-12 w-2/4 pb-12">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold p-2">Game history</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center font-bold text-gray-600 hover:text-yellow-400 transition duration-300"
        >
          See All
          <AiOutlineRight />
        </button>
        {openModal && <HistoryModal setOpenModal={setOpenModal} />}
      </div>
      <div className="border rounded-lg p-4 shadow-md">
        {Array.from({ length: 100 })
          .slice(0, 15)
          .map((test) => {
            return (
              <div className="flex justify-between items-center p-2">
                <div className="flex items-center bg-green-300 rounded-full pr-4">
                  <img
                    src="/images/profile.jpeg"
                    className="w-14 h-14 rounded-full"
                  />
                  <h1 className="text-xl font-bold py-2 px-4 text-green-800">
                    John Doe
                  </h1>
                  <p>10</p>
                </div>
                <span className="text-yellow-400 text-2xl font-bold">VS</span>
                <div className="flex items-center bg-red-300 rounded-full pl-4">
                  <p>7</p>
                  <h1 className="text-xl font-bold py-2 px-4 text-red-800">
                    Saimon dave
                  </h1>
                  <img
                    src="/images/profile.jpeg"
                    className="w-14 h-14 rounded-full"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProfileInfo;
