import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchCurrentUser, User } from "../../features/userProfileSlice";
import { socket } from "../../pages/SocketProvider";
import { FiVideoOff } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface IFrame {
  players: {
    player1: User;
    player2: User;
  };
  score: {
    score1: number;
    score2: number;
  };
}

const LiveGames = () => {
  const [frame, setFrame] = useState<IFrame[]>([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const { loggedUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const watchGame = (id: number) => {
    socket.emit("spectator", id);
    navigate("/watch");
  };

  // const delay = (ms: number) => {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // };

  useEffect(() => {
    socket.emit("liveGames");
    // delay(1000).then(() => {
    //   setRefresh(!refresh);
    // });
    const delay = setTimeout(() => {
      setRefresh(!refresh);
      clearTimeout(delay);
    }, 1000);
    return () => {
      clearTimeout(delay);
    };
  }, [refresh]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    socket.on("liveGame_state", (newState) => {
      setFrame(newState);
    });
    return () => {
      socket.off("liveGame_state");
    };
  }, []);

  return (
    <div className="page-100 mt-20 flex w-full h-full flex-col items-center text-white relative">
      <div className="h-2/3 w-full flex justify-center items-center absolute">
        {!frame.length && (
          <div className="flex justify-center flex-col items-center opacity-40">
            <FiVideoOff size="8rem" className="pb-6" />
            <h1 className="game-family flex items-center text-[9px] sm:text-[17px]">
              NO GAME TO WATCH FOR NOW!
            </h1>
          </div>
        )}
      </div>
      <div className="my-8">
        {frame.map((item, index) => {
          const {
            players: { player1, player2 },
            score: { score1, score2 },
          } = item;
          return (
            <div
              key={index}
              className="sm:w-[39rem] w-[22rem] h-[7rem] bg-black sm:m-6 mb-6 flex justify-between items-center"
            >
              <div className=" bg-black h-[7rem] w-1/2 flex items-center justify-between relative">
                <div className="livegame-left-paddle"></div>
                <div className="flex items-center">
                  <img
                    src={player1.avatar_url}
                    className="sm:w-20 sm:h-20 w-14 h-14 rounded-full m-4 ml-5"
                  />
                  <h1 className="about-family sm:text-[16px] text-[12px]">
                    {player1.user_name.slice(0, 6)}
                  </h1>
                </div>
                <div className="sm:mr-4 -mr-14 game-family sm:text-[20px] text-[12px] font-bold">
                  {score1}
                </div>
              </div>
              <div className="flex p-2 text-center relative h-[7rem] w-48">
                <div className="livegame-net"></div>
                <div className="hover:scale-125 h-4">
                  {loggedUser.state !== "in_game" && (
                    <button
                      className="bg-none game-family rounded sm:text-[11px] text-[9.3px]"
                      onClick={() => {
                        watchGame(player1.id);
                      }}
                    >
                      Watch Game
                    </button>
                  )}
                </div>
              </div>
              <div className=" bg-black h-[7rem] w-1/2 flex items-center justify-between relative">
                <div className="sm:ml-4 -ml-14 game-family sm:text-[20px] text-[12px] font-bold">
                  {score2}
                </div>
                <div className="flex items-center">
                  <h1 className="about-family sm:text-[16px] text-[12px]">
                    {player2.user_name.slice(0, 6)}
                  </h1>
                  <img
                    src={player2.avatar_url}
                    className="sm:w-20 sm:h-20 w-14 h-14 rounded-full m-4 mr-5"
                  />
                </div>
                <div className="livegame-right-paddle"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveGames;
