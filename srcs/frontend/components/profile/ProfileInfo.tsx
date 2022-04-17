import { AiOutlineRight } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";
import { useState } from "react";
import HistoryModal from "../modals/HistoryModal";
import { useAppSelector } from "../../app/hooks";
import { User } from "../../features/userProfileSlice";

interface Props {
  user_me: User;
  users: User[];
}

const ProfileInfo: React.FC<Props> = ({ user_me, users }) => {
  const [openModal, setOpenModal] = useState(false);
  const { isPageLoading, gameHistory } = useAppSelector((state) => state.user);

  return (
    <div className="md:relative left-[26rem] xl:left-[30rem] md:w-[22rem] lg:w-[24rem] xl:w-[28rem]">
      <div className="flex justify-between mr-2">
        <h1 className="about-family text-xl py-2 px-4 text-white text-opacity-80">
          Game history
        </h1>
        {gameHistory.length && (
          <button
            onClick={() => setOpenModal(true)}
            className="about-family flex items-center mr-3 text-sm text-gray-500 header-item transition duration-300"
          >
            See All
            <AiOutlineRight />
          </button>
        )}
        {openModal && <HistoryModal setOpenModal={setOpenModal} />}
      </div>
      <hr className="h-[1px] border-0 mx-4 bg-gray-700" />
      {isPageLoading ? (
        <div className="loading-2 border-2 border-blue-600 w-16 h-16"></div>
      ) : (
        <div className="text-white text-opacity-80">
          {gameHistory.length ? (
            <div>
              {[...gameHistory]
                .reverse()
                .slice(0, 4)
                .map((game) => {
                  const { id, loser, winner, playedAt, score } = game;
                  const [score1, score2] = score
                    .split("-")
                    .map((num) => Number(num))
                    .sort((a, b) => b - a);
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between px-6 py-3 md:px-4"
                    >
                      <div className="flex w-14 items-center space-x-10">
                        <div className="flex flex-col items-center">
                          <img
                            src={winner.avatar_url}
                            alt={winner.user_name}
                            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full"
                          />
                          <h1 className="about-family text-[14px] mt-1">
                            {winner.user_name}
                          </h1>
                        </div>
                      </div>
                      <span className="flex  md:text-xl font-bold space-x-2">
                        <p className="about-family">{score1}</p>
                        <span>-</span>
                        <p className="about-family">{score2}</p>
                      </span>
                      <div className="flex w-14 items-center space-x-10">
                        <div className="flex flex-col items-center">
                          <img
                            src={loser.avatar_url}
                            alt={loser.user_name}
                            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full"
                          />
                          <h1 className="about-family text-[14px] mt-1">
                            {loser.user_name}
                          </h1>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="rounded-lg p-4 shadow-md h-56 bg-white bg-opacity-5">
              <div className="flex flex-col h-full justify-center items-center">
                <p className="p-2 text-gray-200 font-bold opacity-30">
                  No matches
                </p>
                <FaHistory className="w-20 h-20 text-gray-200 opacity-30" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
