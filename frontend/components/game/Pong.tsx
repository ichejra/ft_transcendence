import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../app/hooks";
import { User } from "../../features/userProfileSlice";
import { socket } from "../../pages/SocketProvider";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  B_RADIUS,
  BALL_INIT_X,
  BALL_INIT_Y,
  PAD_WIDTH,
  PAD_HEIGHT,
  L_PADX,
  R_PADX,
  PADY_INIT,
  NET_W,
  NET_H,
  NETX,
  NETY,
  Rect,
  Circle,
  Text,
  IFrame,
} from "./GameConsts";
import GameRules from "./GameRules";
import { GiTrophyCup } from "react-icons/gi";
import LeaderBoard from "./LeaderBoard";

class Paddle extends Rect {}
class Ball extends Circle {}
class Score extends Text {}

const stateInit: IFrame = {
  ball: {
    x: BALL_INIT_X,
    y: BALL_INIT_Y,
  },
  paddles: {
    leftPad: PADY_INIT,
    rightPad: PADY_INIT,
    leftPadH: PAD_HEIGHT,
    rightPadH: PAD_HEIGHT,
  },
  score: {
    score1: 0,
    score2: 0,
  },
  state: "void",
  isWinner: false,
};

interface UserType {
  userType: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let isRefresh = false;

const Pong: React.FC<UserType> = ({ userType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playBtnsRef: React.RefObject<HTMLDivElement> = React.createRef();
  const [frame, setFrame] = useState(stateInit);
  const [users, setUsers] = useState<User[]>([]);
  const [leftPlayer, setLeftPlayer] = useState<User>(users[0]);
  const [rightPlayer, setRightPlayer] = useState<User>(users[1]);
  const [joined, setJoined] = useState(false);
  const [openLeaderBoard, setOpenLeaderBoard] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (userType === "spectator" && location.pathname !== "/watch")
      socket.emit("spectator_left");
  }, []);

  const joinMatch = () => {
    socket.emit("join_queue", "default");
    setJoined(true);
  };
  const joinMatchWithObstacle = () => {
    socket.emit("join_queue", "obstacle");
    setJoined(true);
  };

  useEffect(() => {
    socket.on("unjoin_queue", () => {
      setJoined(false);
    });
  }, []);

  const handlePlayAgain = () => {
    socket.emit("spectator_left");
    setUsers([]);
    setFrame(stateInit);
    setJoined(false);
  };
  const handlePlayForSpec = () => {
    socket.emit("spectator_left");
    setUsers([]);
    setFrame(stateInit);
    setJoined(false);
    navigate("/game");
  };

  if (
    userType === "player" &&
    users.length > 1 &&
    users[0].id !== loggedUser.id &&
    users[1].id !== loggedUser.id
  ) {
    handlePlayAgain();
  }
  
  if (userType === "player" && !leftPlayer) {
    socket.emit("spectator_left");
  }

  //* keep rendering the game if a player changed the location
  useEffect(() => {
    if (users.length !== 0) return;
    socket.emit("isAlreadyInGame");
    socket.on("set_users", (players) => {
      isRefresh = true;
      setUsers(players);
    });
    return () => {
      socket.off("set_users");
    };
  }, []);

  //* joined the queue and waiting for the other component
  useEffect(() => {
    if (users.length !== 0) return;
    socket.emit("isJoined");
    socket.on("joined", (join) => {
      setJoined(join);
    });
    return () => {
      socket.off("joined");
    };
  }, [location]);

  //* move paddles
  const movePaddle = (e: any) => {
    if (e.code === "ArrowUp") {
      socket.emit("ArrowUp", "down");
    } else if (e.code === "ArrowDown") {
      socket.emit("ArrowDown", "down");
    }
  };
  const stopPaddle = (e: any) => {
    if (e.code === "ArrowUp") {
      socket.emit("ArrowUp", "up");
    } else if (e.code === "ArrowDown") {
      socket.emit("ArrowDown", "up");
    }
  };

  useEffect(() => {
    if (location.pathname === "/game") {
      document.addEventListener("keydown", movePaddle);
      document.addEventListener("keyup", stopPaddle);
    }
    socket.on("game_state", (newState) => {
      setFrame(newState);
    });
    return () => {
      document.removeEventListener("keydown", movePaddle);
      document.removeEventListener("keyup", stopPaddle);
      socket.off("game_state");
    };
  }, [location]);

  //* render pong game
  useEffect(() => {
    if (canvasRef == null) return;
    const canvas = canvasRef.current;
    const ctx = canvas != null ? canvas.getContext("2d") : null;
    if (ctx != null && frame.state != "void") {
      const table = new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "black", ctx);
      table.drawRect();
      for (let i = 0; i <= ctx.canvas.height; i += 16) {
        const net = new Rect(NETX, NETY + i, NET_W, NET_H, "gray", ctx);
        net.drawRect();
      }
      const paddle1 = new Paddle(
        L_PADX,
        frame.paddles.leftPad,
        PAD_WIDTH,
        frame.paddles.leftPadH,
        "white",
        ctx
      );
      paddle1.drawRect();
      const paddle2 = new Paddle(
        R_PADX,
        frame.paddles.rightPad,
        PAD_WIDTH,
        frame.paddles.rightPadH,
        "white",
        ctx
      );
      paddle2.drawRect();
      const ball = new Ball(frame.ball.x, frame.ball.y, B_RADIUS, "white", ctx);
      ball.drawCircle();
      const player1Score = new Score(
        CANVAS_WIDTH / 4,
        CANVAS_HEIGHT / 5,
        frame.score.score1.toString(),
        "lightgrey",
        ctx
      );
      player1Score.drawText();
      const player2Score = new Score(
        (3 * CANVAS_WIDTH) / 4,
        CANVAS_HEIGHT / 5,
        frame.score.score2.toString(),
        "lightgrey",
        ctx
      );
      player2Score.drawText();
      if (frame.state === "OVER") {
        const ball = new Ball(
          frame.ball.x,
          frame.ball.y,
          B_RADIUS,
          "black",
          ctx
        );
        ball.drawCircle();
        const gameOver = new Text(
          (2.85 * CANVAS_WIDTH) / 8,
          CANVAS_HEIGHT / 2,
          "GAME OVER",
          "lightgrey",
          ctx
        );
        for (let i = 0; i <= ctx.canvas.height; i += 16) {
          const net = new Rect(NETX, NETY + i, NET_W, NET_H, "gray", ctx);
          net.drawRect();
        }
        gameOver.drawText();
        if (userType === "player") {
          if (frame.isWinner) {
            let position;
            if (frame.score.score1 > frame.score.score2)
              position = (1 * CANVAS_WIDTH) / 6;
            else position = (3.9 * CANVAS_WIDTH) / 6;
            const playerMsg = new Text(
              position,
              CANVAS_HEIGHT / 3,
              "YOU WIN",
              "lightgrey",
              ctx
            );
            playerMsg.drawText();
          } else {
            let position;
            if (frame.score.score1 > frame.score.score2)
              position = (3.6 * CANVAS_WIDTH) / 6;
            else position = (1 * CANVAS_WIDTH) / 8;
            const playerMsg = new Text(
              position,
              CANVAS_HEIGHT / 3,
              "YOU LOOSE",
              "lightgrey",
              ctx
            );
            playerMsg.drawText();
          }
        } else if (userType === "spectator") {
          let playerMsg;
          if (frame.score.score1 > frame.score.score2) {
            playerMsg = new Text(
              (1 * CANVAS_WIDTH) / 6,
              CANVAS_HEIGHT / 3,
              "WINNER",
              "lightgrey",
              ctx
            );
            playerMsg.drawText();
            playerMsg = new Text(
              (3.9 * CANVAS_WIDTH) / 6,
              CANVAS_HEIGHT / 3,
              "LOOSER",
              "lightgrey",
              ctx
            );
            playerMsg.drawText();
          } else {
            playerMsg = new Text(
              (1 * CANVAS_WIDTH) / 6,
              CANVAS_HEIGHT / 3,
              "LOOSER",
              "lightgrey",
              ctx
            );
            playerMsg.drawText();
            playerMsg = new Text(
              (3.9 * CANVAS_WIDTH) / 6,
              CANVAS_HEIGHT / 3,
              "WINNER",
              "lightgrey",
              ctx
            );
            playerMsg.drawText();
          }
        }
      }
    }
  }, [frame]);

  useEffect(() => {
    if (users.length) {
      setLeftPlayer(users[0]);
      setRightPlayer(users[1]);
    }
  }, [users]);

  useEffect(() => {
    if (userType === "spectator") {
      delay(1000).then(() => {
        if (!isRefresh) {
          navigate("/liveGames");
        }
      });
    }
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center relative">
      {users.length === 0 && userType === "player" && (
        <div className="text-white w-full grid sm:justify-items-end absolute  top-24 sm:right-8 justify-items-center">
          <div
            className="tooltip border-2 border-yellow-300 shadow-lg shadow-yellow-600/60 rounded-full p-1 w-24 h-24 flex justify-center items-center cursor-pointer hover:border-yellow-400"
            onClick={() => setOpenLeaderBoard(true)}
          >
            <span className="tooltiptext border flex justify-center items-center top-2 right-20">
              Leader Board
            </span>
            <GiTrophyCup
              size="5rem"
              className="border-2 border-yellow-300 p-2 text-yellow-300 hover:text-yellow-400 hover:border-yellow-400"
            />
          </div>
          {openLeaderBoard && <LeaderBoard setOpenModal={setOpenLeaderBoard} />}
        </div>
      )}
      {users.length === 0 && userType === "player" && (
        <div className="items-center flex justify-center p-22 md:mt-64 mt-52">
          <GameRules />
        </div>
      )}
      {userType === "player" && users.length === 0 && joined === false && (
        <div
          ref={playBtnsRef}
          className="flex md:flex-row flex-col items-center justify-between md:w-[43rem] lg:w-[50rem] mx-10 my-20 md:m-20"
        >
          <div className="button">
            <button type="button" className="text-white" onClick={joinMatch}>
              Play Pong
            </button>
          </div>
          <div className="button">
            <button className="text-white" onClick={joinMatchWithObstacle}>
              Play Our Pong
            </button>
          </div>
        </div>
      )}
      {joined === true && users.length === 0 && (
        <div className="text-white m-20">Waiting For Your Opponent...</div>
      )}
      {users.length !== 0 && (
        <div className="border-4 border-[lightgrey] mt-52">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ width: "100%" }}
          ></canvas>
        </div>
      )}
      <div className="">
        {users.length !== 0 && (
          <div className="w-full md:w-[45rem] flex items-center justify-between my-16 md:mb-2">
            <div className=" flex flex-col items-center mr-10 sm:mr-24">
              <img
                src={leftPlayer?.avatar_url}
                className="w-16 h-16 sm:w-28 sm:h-28 md:w-44 md:h-44 rounded-full mb-2"
              />
              <h1 className="text-white text-center sm:text-[16px] text-[12px]">
                {leftPlayer?.display_name}
              </h1>
            </div>
            <div className="flex flex-col items-center ml-10 sm:ml-24">
              <img
                src={rightPlayer?.avatar_url}
                className="w-16 h-16 sm:w-28 sm:h-28 md:w-44 md:h-44 rounded-full mb-2"
              />
              <h1 className="text-white text-center sm:text-[16px] text-[12px]">
                {rightPlayer?.display_name}
              </h1>
            </div>
          </div>
        )}
        {frame.state === "OVER" && userType === "player" && (
          <div className="play-again-btn mb-44">
            <button onClick={handlePlayAgain}>Play Again</button>
          </div>
        )}
        {frame.state === "OVER" &&
          userType === "spectator" &&
          location.pathname === "/watch" && (
            <div className="play-again-btn items-center mb-44">
              <button onClick={handlePlayForSpec}>Play Now</button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Pong;
