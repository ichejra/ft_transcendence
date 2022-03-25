import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAppSelector } from '../../app/hooks';
import { User } from '../../features/userProfileSlice';
import { socket } from '../../pages/SocketProvider';
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
} from './GameConsts';
import GameRules from './GameRules';

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
  state: 'void',
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
  console.log('Pong game built');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playBtnsRef: React.RefObject<HTMLDivElement> = React.createRef();
  const usersRef: React.RefObject<HTMLDivElement> = React.createRef();
  const [frame, setFrame] = useState(stateInit);
  const [users, setUsers] = useState<User[]>([]);
  const [leftPlayer, setLeftPlayer] = useState<User>(users[0]);
  const [rightPlayer, setRightPlayer] = useState<User>(users[1]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useAppSelector((state) => state.user.user.id);

  // console.log('user type: ', userType);
  // console.log('location: ', location);
  useEffect(() => {
    console.log('location: ', location);
    console.log('user type: ', userType);
    console.log('player: ', leftPlayer);
  }, [location]);

  const joinMatch = () => {
    socket.emit('join_queue', 'default');
  };
  const joinMatchWithObstacle = () => {
    socket.emit('join_queue', 'obstacle');
  };
  // const stopMatch = () => {
  //   socket.emit('stop_game', 'default');
  // };
  const handlePlayAgain = () => {
    console.log('reset game');
    socket.emit('spectator_left');
    setUsers([]);
    setFrame(stateInit);
    // document.getElementById('canvas')?.remove();
    // playBtnsRef.current?.style.display = 'block';
  };
  const movePaddle = (e: any) => {
    if (e.code === 'ArrowUp') {
      // console.log('------> keydown');
      socket.emit('ArrowUp', 'down');
    } else if (e.code === 'ArrowDown') {
      socket.emit('ArrowDown', 'down');
    }
  };
  const stopPaddle = (e: any) => {
    if (e.code === 'ArrowUp') {
      socket.emit('ArrowUp', 'up');
    } else if (e.code === 'ArrowDown') {
      socket.emit('ArrowDown', 'up');
    }
  };

  if (
    userType === 'player' &&
    users.length > 1 &&
    users[0].id !== userId &&
    users[1].id !== userId
  ) {
    handlePlayAgain();
    // return;
  }
  if (userType === 'player' && !leftPlayer) {
    socket.emit('spectator_left');
  }

  useEffect(() => {
    if (users.length !== 0) return;
    console.log('users length: ', users.length);
    socket.emit('isAlreadyInGame');
    socket.on('set_users', (players) => {
      console.log('players', players);
      isRefresh = true;
      setUsers(players);
    });
    return () => {
      socket.off('set_users');
    };
  }, []);

  useEffect(() => {
    if (userType !== 'spectator') {
      document.addEventListener('keydown', movePaddle);
      document.addEventListener('keyup', stopPaddle);
    }
    socket.on('game_state', (newState) => {
      setFrame(newState);
      // console.log('I am frame from front', userType);
    });
    return () => {
      if (userType !== 'spectator') {
        document.removeEventListener('keydown', movePaddle);
        document.removeEventListener('keyup', stopPaddle);
      }
      socket.off('game_state');
    };
  }, []);

  useEffect(() => {
    if (canvasRef == null) return;
    const canvas = canvasRef.current;
    const ctx = canvas != null ? canvas.getContext('2d') : null;
    if (ctx != null && frame.state != 'void') {
      //! /////////
      // if (canvas) {
      //   canvas.style.display = 'block';
      // }
      if (playBtnsRef != null)
        if (playBtnsRef.current != null) {
          playBtnsRef.current.style.display = 'none';
        }
      //! /////////
      const table = new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black', ctx);
      table.drawRect();
      for (let i = 0; i <= ctx.canvas.height; i += 16) {
        const net = new Rect(NETX, NETY + i, NET_W, NET_H, 'gray', ctx);
        net.drawRect();
      }
      const paddle1 = new Paddle(
        L_PADX,
        frame.paddles.leftPad,
        PAD_WIDTH,
        frame.paddles.leftPadH,
        'white',
        ctx
      );
      paddle1.drawRect();
      const paddle2 = new Paddle(
        R_PADX,
        frame.paddles.rightPad,
        PAD_WIDTH,
        frame.paddles.rightPadH,
        'white',
        ctx
      );
      paddle2.drawRect();
      const ball = new Ball(
        frame.ball.x,
        frame.ball.y,
        BALL_RADIUS,
        'white',
        ctx
      );
      ball.drawCircle();
      const player1Score = new Score(
        CANVAS_WIDTH / 4,
        CANVAS_HEIGHT / 5,
        frame.score.score1.toString(),
        'lightgrey',
        ctx
      );
      player1Score.drawText();
      const player2Score = new Score(
        (3 * CANVAS_WIDTH) / 4,
        CANVAS_HEIGHT / 5,
        frame.score.score2.toString(),
        'lightgrey',
        ctx
      );
      player2Score.drawText();
      if (frame.state === 'OVER') {
        const ball = new Ball(
          frame.ball.x,
          frame.ball.y,
          BALL_RADIUS,
          'black',
          ctx
        );
        ball.drawCircle();
        // const clearTable = new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black', ctx);
        // clearTable.drawRect();
        const gameOver = new Text(
          (2.85 * CANVAS_WIDTH) / 8,
          CANVAS_HEIGHT / 2,
          'GAME OVER',
          'lightgrey',
          ctx
        );
        for (let i = 0; i <= ctx.canvas.height; i += 16) {
          const net = new Rect(NETX, NETY + i, NET_W, NET_H, 'gray', ctx);
          net.drawRect();
        }
        gameOver.drawText();
        if (userType === 'player') {
          if (frame.isWinner) {
            let position;
            if (frame.score.score1 > frame.score.score2)
              position = (1 * CANVAS_WIDTH) / 6;
            else position = (3.9 * CANVAS_WIDTH) / 6;
            //! ///////////////////////
            const playerMsg = new Text(
              position,
              CANVAS_HEIGHT / 3,
              'YOU WIN',
              'lightgrey',
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
              'YOU LOOSE',
              'lightgrey',
              ctx
            );
            playerMsg.drawText();
          }
        } else if (userType === 'spectator') {
          let playerMsg;
          if (frame.score.score1 > frame.score.score2) {
            playerMsg = new Text(
              (1 * CANVAS_WIDTH) / 6,
              CANVAS_HEIGHT / 3,
              'WINNER',
              'lightgrey',
              ctx
            );
            playerMsg.drawText();
            playerMsg = new Text(
              (3.9 * CANVAS_WIDTH) / 6,
              CANVAS_HEIGHT / 3,
              'LOOSER',
              'lightgrey',
              ctx
            );
            playerMsg.drawText();
          } else {
            playerMsg = new Text(
              (1 * CANVAS_WIDTH) / 6,
              CANVAS_HEIGHT / 3,
              'LOOSER',
              'lightgrey',
              ctx
            );
            playerMsg.drawText();
            playerMsg = new Text(
              (3.9 * CANVAS_WIDTH) / 6,
              CANVAS_HEIGHT / 3,
              'WINNER',
              'lightgrey',
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
    if (userType === 'spectator') {
      delay(1000).then(() => {
        if (!isRefresh) {
          navigate('/liveGames');
        }
      });
    }

    // return ()=>
  });


  return (
    <div className='flex w-full flex-col items-center relative'>
      {users.length === 0 && userType === 'player' && (
        <div className='absolute  -mt-[26rem] items-center flex justify-center p-22 md:w-[62rem] lg:w-[74rem]'>
          <GameRules />
        </div>
      )}
      {userType === 'player' && users.length === 0 && (
        <div
          ref={playBtnsRef}
          className='flex md:flex-row flex-col items-center justify-between mt-10 md:w-[50rem] absolute'
        >
          <div className='button '>
            <button type='button' className='text-white' onClick={joinMatch}>
              Play Pong
            </button>
          </div>
          {/* <div className='button'>
          <button className='text-white' onClick={stopMatch}>
            Stop Now
          </button>
        </div> */}
          <div className='button'>
            <button className='text-white' onClick={joinMatchWithObstacle}>
              Play Our Pong
            </button>
          </div>
        </div>
      )}
      {users.length !== 0 && (
        <div className='border-4 border-[lightgrey]'>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
          ></canvas>
        </div>
      )}
      <div className=''>
        {users.length !== 0 && (
          <div className='w-[24rem] md:w-[50rem] flex items-center justify-between'>
            <div className=' flex flex-col items-center'>
              <img
                src={leftPlayer?.avatar_url}
                className='w-28 h-28 md:w-44 md:h-44 rounded-full m-4'
              />
              <h1 className='text-white text-center'>
                {leftPlayer?.display_name}
              </h1>
            </div>
            <div className='items-center'>
              <img
                src={rightPlayer?.avatar_url}
                className='w-28 h-28 md:w-44 md:h-44 rounded-full m-4'
              />
              <h1 className='text-white text-center'>
                {rightPlayer?.display_name}
              </h1>
            </div>
          </div>
        )}
        {frame.state === 'OVER' && userType === 'player' && (
          <div className='play-again-btn items-center mt-10 md:m-2'>
            <button onClick={handlePlayAgain}>Play Again</button>
          </div>
        )}
        {frame.state === 'OVER' &&
          userType === 'spectator' &&
          location.pathname === '/watch' && (
            <div className='play-again-btn items-center'>
              <button
                onClick={() => {
                  navigate('/game');
                }}
              >
                Play Now
              </button>
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

//TODO: play and pause //! makainax f subject
//TODO: when game is over and userType is spectator: navigate to game or live game
//TODO: handle the prb of the live game interventing with game
