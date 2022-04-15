import { useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppSelector } from "../../app/hooks";

interface Props {
  setOpenModal: (a: boolean) => void;
}

const LeaderBoard: React.FC<Props> = ({ setOpenModal }) => {
  const divRef = useRef(null);
  // const { gameHistory } = useAppSelector((state) => state.user);
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
              {Array.from({ length: 10 }).map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`w-11/12 md:w-[38rem] h-[6rem] m-6 mb-1 flex justify-between rounded-t-md items-center shadow-lg shadow-white/40 ${index === 0 ? "bg-yellow-500" : index===1 ? "bg-zinc-400" : index===2? "bg-amber-700" : "bg-black"}  relative  border-t-2 border-x-2 border-t-[lightgrey]`}
                  >
                    <div className="w-1/2 ">
                      <div className="flex items-center">
                        <img
                          src="/images/profile.jpeg"
                          className="sm:w-20 sm:h-20 h-14 w-16 rounded-full sm:m-4 sm:ml-5 m-1 ml-2"
                        />
                        <h1
                          className="game-family sm:text-[20px] text-[11px] cursor-pointer "
                          // onClick={() = got to user profile}
                        >
                          lalala
                        </h1>
                      </div>
                    </div>
                    <div className="sm:mr-16 mr-2 game-family sm:text-[25px] text-[14px] font-bold flex items-center">
                      <span className="sm:text-[12px] text-[7px]">Points:</span>
                      100
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
