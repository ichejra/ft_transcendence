import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../app/hooks";
import { User } from "../../features/userProfileSlice";
import { socket } from "../../pages/SocketProvider";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_SCORE,
  MAX_WATCHERS,
  BALL_RADIUS,
  BALL_INIT_X,
  BALL_INIT_Y,
  BALL_SPEED,
  BALL_MAX_SPEED,
  PAD_WIDTH,
  PAD_HEIGHT,
  PADDLE_DIFF,
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

class Paddle extends Rect {}
class Ball extends Circle {}
class Score extends Text {}

import { Link } from "react-router-dom";

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
  // console.log("Pong game built ==> |" + userType + "|");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playBtnsRef: React.RefObject<HTMLDivElement> = React.createRef();
  const usersRef: React.RefObject<HTMLDivElement> = React.createRef();
  const [frame, setFrame] = useState(stateInit);
  const [users, setUsers] = useState<User[]>([]);
  const [leftPlayer, setLeftPlayer] = useState<User>(users[0]);
  const [rightPlayer, setRightPlayer] = useState<User>(users[1]);
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedUser } = useAppSelector((state) => state.user);

  // console.log('user type: ', userType);
  // console.log('location: ', location.pathname);
  useEffect(() => {
    // console.log('location: ', location);
    // console.log('user type: ', userType);
    // console.log('player: ', leftPlayer);
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
    // socket.emit("check_joined_queue");
    // socket.on("joined_queue", () => {
    //   setJoined(true);
    // });
    // return () => {
    //   socket.off("joined");
    // };
    socket.on("unjoin_queue", () => {
      setJoined(false);
    });
  }, []);

  // const stopMatch = () => {
  //   socket.emit('stop_game', 'default');
  // };
  const handlePlayAgain = () => {
    // console.log('reset game');
    socket.emit("spectator_left");
    setUsers([]);
    setFrame(stateInit);
    setJoined(false);
    // document.getElementById('canvas')?.remove();
    // playBtnsRef.current?.style.display = 'block';
  };
  const handlePlayForSpec = () => {
    console.log("handle play for spec");
    socket.emit("spectator_left");
    setUsers([]);
    setFrame(stateInit);
    setJoined(false);
    // userType = 'player';
    navigate("/game");
  };

  if (
    userType === "player" &&
    users.length > 1 &&
    users[0].id !== loggedUser.id &&
    users[1].id !== loggedUser.id
  ) {
    handlePlayAgain();
    // return;
  }

  if (userType === "player" && !leftPlayer) {
    socket.emit("spectator_left");
  }
  //* chek if the users still in game to protect the render of the game when a player navigate to another page
  useEffect(() => {
    if (users.length !== 0) return;
    socket.emit("isAlreadyInGame");
    socket.on("set_users", (players) => {
      console.log("players", players);
      isRefresh = true;
      setUsers(players);
      console.log("users length: ", users.length);
    });
    return () => {
      socket.off("set_users");
    };
  }, []);

  //* check if the player is joined to a queue to hide the buttons
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
    console.log("userType: ==================>|" + userType + "|");
    if (location.pathname === "/game") {
      document.addEventListener("keydown", movePaddle);
      document.addEventListener("keyup", stopPaddle);
    }
    console.log("I am frame from front", userType);
    socket.on("game_state", (newState) => {
      setFrame(newState);
    });
    return () => {
      // if (userType !== "spectator") {
      document.removeEventListener("keydown", movePaddle);
      document.removeEventListener("keyup", stopPaddle);
      // }
      socket.off("game_state");
    };
  }, [location]);

  //* render pong game
  useEffect(() => {
    if (canvasRef == null) return;
    const canvas = canvasRef.current;
    const ctx = canvas != null ? canvas.getContext("2d") : null;
    if (ctx != null && frame.state != "void") {
      // if (playBtnsRef != null) {
      //   if (playBtnsRef.current != null) {
      //     playBtnsRef.current.style.display = 'none';
      //   }
      // }
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
      const ball = new Ball(
        frame.ball.x,
        frame.ball.y,
        BALL_RADIUS,
        "white",
        ctx
      );
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
          BALL_RADIUS,
          "black",
          ctx
        );
        ball.drawCircle();
        // const clearTable = new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black', ctx);
        // clearTable.drawRect();
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
            //! ///////////////////////
            const playerMsg = new Text(
              position,
              CANVAS_HEIGHT / 3,
              "YOU WIN",
              "lightgrey",
              ctx
            );
            playerMsg.drawText();
            //! ///////////////////////
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
    // return ()=>
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center">
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
          {/* <div className='button'>
          <button className='text-white' onClick={stopMatch}>
            Stop Now
          </button>
        </div> */}
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

//* Done: show the score on the screen
//* Done: stop the game when a score reaches the max score
//* DONE: show the uttons only if the userType is a player
//* DONE: set winner and looser
//* DONE: add game over in the end of the game and the winner for the winner and loser for the looser
//* DONE: add Live Games page and update it every little bit by listening on a socket every 1s or so
//* DONE: when game is over and userType is spectator: navigate to game or live game
//* DONE (wa9): handle the prb of the live game interventing with game

//TODO: joined not working if player navigate to other path
//TODO: play and pause //! makainax f subject
//TODO: make leader board as modal
