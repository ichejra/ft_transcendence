import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsersRank } from "../../features/userProfileSlice";

interface Props {
  setOpenModal: (a: boolean) => void;
}

const LeaderBoard: React.FC<Props> = ({ setOpenModal }) => {
  const divRef = useRef(null);
  const dispatch = useAppDispatch();
  const { leaderboard } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsersRank());
  }, []);

  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) setOpenModal(false);
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full mt-20 md:mt-0"
      >
        <div className="text-gray-200 overflow-auto no-scrollbar md:h-[40rem] w-full pb-24 md:pb-0 md:w-[40rem] rounded-xl p-4">
          <div className="flex justify-between items-center mx-2 mb-4 md:mb-10">
            <h1 className="text-[lightgray] sm:text-[20px] text-[16px] underline underline-offset-2 game-family">
              LEADER BOARD
            </h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer transition duration-300 hover:text-yellow-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
          <div className="mb-20">
            <div className="flex justify-center flex-col items-center">
              {leaderboard.map((userScore, index) => {
                const { user, score } = userScore;
                return (
                  <div
                    key={index}
                    className={`w-11/12 md:w-[38rem] h-[5rem] md:h-[6rem] m-6 mb-1 flex justify-between rounded-t-md items-center shadow-lg shadow-white/40 ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-zinc-400"
                        : index === 2
                        ? "bg-amber-600"
                        : "bg-black"
                    }  relative  border-t-2 border-x-2 border-t-[lightgrey]`}
                  >
                    <div className="w-full">
                      <div className="flex items-center w-full">
                        <img
                          src={user.avatar_url}
                          alt={user.user_name}
                          className="sm:w-20 sm:h-20 w-14 h-14 rounded-full sm:m-4 sm:ml-5 mx-2"
                        />
                        <div className="flex justify-between items-center w-full">
                          <h1 className="game-family sm:text-[20px] text-[11px] cursor-pointer ">
                            {user.user_name}
                          </h1>
                          <div className="sm:mr-16 mr-2 game-family sm:text-[25px] text-[14px] font-bold flex items-center">
                            <span className="hidden sm:block sm:text-[12px] text-[7px]">
                              Points:
                            </span>
                            {score}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
