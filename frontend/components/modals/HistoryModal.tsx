import { useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppSelector } from "../../app/hooks";

interface Props {
  setOpenModal: (a: boolean) => void;
}

const HistoryModal: React.FC<Props> = ({ setOpenModal }) => {
  const divRef = useRef(null);
  const { gameHistory } = useAppSelector((state) => state.user);
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
        <div className="user-card-bg text-gray-200 overflow-auto md:h-[40rem] w-full pb-24 md:pb-0 md:w-[40rem] rounded-xl p-4">
          <div className="flex justify-between items-center mx-2 mb-4 md:mb-10">
            <h1 className="font-medium font-sans text-3xl">History</h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer header-item transition duration-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
          {[...gameHistory].reverse().map((game) => {
            const { id, loser, winner, playedAt, score } = game;
            const [score1, score2] = score
              .split("-")
              .map((num) => Number(num))
              .sort((a, b) => b - a);
            return (
              <div
                key={id}
                className="flex items-center justify-between px-6 py-3 md:px-4 border border-gray-700 my-2 rounded-md"
              >
                <div className="flex items-center space-x-10">
                  <div className="flex w-14 flex-col items-center">
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
      </div>
    </div>
  );
};

export default HistoryModal;
