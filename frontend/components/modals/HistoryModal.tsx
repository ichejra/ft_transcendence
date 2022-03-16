import { useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "../../features/userProfileSlice";

interface Props {
  setOpenModal: (a: boolean) => void;
  user: User;
}

const HistoryModal: React.FC<Props> = ({ setOpenModal, user }) => {
  const divRef = useRef(null);
  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) setOpenModal(false);
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="user-card-bg text-gray-200 overflow-auto md:h-[40rem] w-full md:w-[40rem] rounded-xl p-4">
          <div className="flex justify-between items-center mx-2 mb-10">
            <h1 className="font-medium font-sans text-3xl">History</h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer header-item transition duration-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
          {Array.from({ length: 50 }).map((test, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-3 md:px-4 border border-gray-700 my-2 rounded-md"
              >
                <div className="flex items-center space-x-10">
                  <div className="flex flex-col items-center">
                    <img
                      src={user.avatar_url}
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full"
                    />
                    <h1 className="about-family text-[14px] mt-1">
                      {user.user_name}
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
    </div>
  );
};

export default HistoryModal;
