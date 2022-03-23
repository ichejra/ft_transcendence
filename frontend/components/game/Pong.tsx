import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { User } from '../../features/userProfileSlice';
// import { io } from 'socket.io-client';
import { socket } from '../../pages/SocketProvider';
// import { socket } from '/Users/ichejra/Desktop/ft_trans/frontend/pages/SocketProvider.tsx';

// const socket = io('http://localhost:3000/game'); //! remove it later

const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 1000;
const MAX_SCORE = 10;
const MAX_WATCHERS = 10;
const BALL_RADIUS = 12;
const BALL_INIT_X = CANVAS_WIDTH / 2;
const BALL_INIT_Y = CANVAS_HEIGHT / 2;
const BALL_SPEED = 6;
const BALL_MAX_SPEED = 15;
const PAD_WIDTH = 15;
const PAD_HEIGHT = 100;
const PADDLE_DIFF = 10;
const L_PADX = 0 + 20;
const R_PADX = CANVAS_WIDTH - PAD_WIDTH - 20;
const PADY_INIT = CANVAS_HEIGHT / 2 - PAD_HEIGHT / 2;

const NET_W = 5;
const NET_H = 10;
const NETX = CANVAS_WIDTH / 2 - NET_W / 2;
const NETY = 0;

class Rect {
  _ctx: any;
  _x: number;
  _y: number;
  _w: number;
  _h: number;
  _color: string;
  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    ctx: any
  ) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this._color = color;
    this._ctx = ctx;
  }
  drawRect() {
    this._ctx.fillStyle = this._color;
    this._ctx.fillRect(this._x, this._y, this._w, this._h);
  }
}

// const net = {
//   x: 1000 / 2 - 5 / 2, //first 2 is the width
//   y: 0,
//   width: 5,
//   height: 10,
//   color: 'white',
// };
class Circle {
  _ctx: any;
  _x: number;
  _y: number;
  _r: number;
  _color: string;
  constructor(x: number, y: number, r: number, color: string, ctx: any) {
    this._ctx = ctx;
    this._x = x;
    this._y = y;
    this._r = r;
    this._color = color;
  }
  drawCircle() {
    this._ctx.fillStyle = this._color;
    this._ctx.beginPath();
    this._ctx.arc(this._x, this._y, this._r, 0, Math.PI * 2, false);
    this._ctx.closePath();
    this._ctx.fill();
  }
}

class Text {
  _x: number;
  _y: number;
  _text: string;
  _color: string;
  _ctx: any;

  constructor(x: number, y: number, text: string, color: string, ctx: any) {
    this._x = x;
    this._y = y;
    this._text = text;
    this._color = color;
    this._ctx = ctx;
  }
  drawText() {
    this._ctx.fillStyle = this._color;
    this._ctx.font = '45px fantasy';
    this._ctx.fillText(this._text, this._x, this._y);
  }
}

interface IFrame {
  players?: {
    user1: User;
    user2: User;
  };
  ball: {
    x: number;
    y: number;
  };
  paddles: {
    leftPad: number;
    rightPad: number;
    leftPadH: number;
    rightPadH: number;
  };
  score: {
    score1: number;
    score2: number;
  };
  state: string;
  isWinner: boolean;
}

class Paddle extends Rect {}
class Net extends Rect {}
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

const Pong: React.FC<UserType> = ({ userType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playBtnsRef: React.RefObject<HTMLDivElement> = React.createRef();
  const [frame, setFrame] = useState(stateInit);
  const [users, setUsers] = useState<User[]>([]);
  const [leftPlayer, setLeftPlayer] = useState<User>(users[0]);
  const [rightPlayer, setRightPlayer] = useState<User>(users[1]);
  console.log('user type: ', userType);

  const joinMatch = () => {
    socket.emit('join_queue', 'default');
  };
  const joinMatchWithObstacle = () => {
    socket.emit('join_queue', 'obstacle');
  };
  const stopMatch = () => {
    socket.emit('stop_game', 'default');
  };
  const movePaddle = (e: any) => {
    if (e.code === 'ArrowUp') {
      console.log('------> keydown');
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
  // useEffect(() => {
  //   socket.emit('get_users');
  // }, [])

  useEffect(() => {
    socket.on('set_users', (players) => {
      setUsers(players);
    });
  }, []);

  useEffect(() => {
    if (userType !== 'spectator') {
      document.addEventListener('keydown', movePaddle);
      document.addEventListener('keyup', stopPaddle);
    }
    socket.on('game_state', (newState) => {
      setFrame(newState);
      console.log('I am frame from front', userType);
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
      if (canvas) canvas.style.display = 'block';

      if (playBtnsRef != null)
        if (playBtnsRef.current != null)
          playBtnsRef.current.style.display = 'none';
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
        'white',
        ctx
      );
      player1Score.drawText();
      const player2Score = new Score(
        (3 * CANVAS_WIDTH) / 4,
        CANVAS_HEIGHT / 5,
        frame.score.score2.toString(),
        'white',
        ctx
      );
      // console.log(frame.score.score1);
      // console.log(frame.score.score2);
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
          'white',
          ctx
        );
        for (let i = 0; i <= ctx.canvas.height; i += 16) {
          const net = new Rect(NETX, NETY + i, NET_W, NET_H, 'gray', ctx);
          net.drawRect();
        }
        gameOver.drawText();
        if (frame.isWinner) {
          let position;
          if (frame.score.score1 > frame.score.score2)
            position = (1 * CANVAS_WIDTH) / 6;
          else position = (5 * CANVAS_WIDTH) / 6;
          //! ///////////////////////
          const playerMsg = new Text(
            position,
            CANVAS_HEIGHT / 3,
            'YOU WIN',
            'white',
            ctx
          );
          playerMsg.drawText();
          //! ///////////////////////
          // const playerMsg = new Text(
          //   (3 * CANVAS_WIDTH) / 8,
          //   CANVAS_HEIGHT / 3,
          //   'YOU WIN',
          //   'white',
          //   ctx
          // );

          // const table = new Rect(
          //   0,
          //   0,
          //   CANVAS_WIDTH,
          //   CANVAS_HEIGHT,
          //   '#45C830',
          //   ctx
          // );
          // table.drawRect();
          // playerMsg.drawText();

          // console.log('winner');
        } else {
          // console.log('loooser');
          let position;
          if (frame.score.score1 > frame.score.score2)
            position = (3.6 * CANVAS_WIDTH) / 6;
          else position = (1 * CANVAS_WIDTH) / 6;
          const playerMsg = new Text(
            position,
            CANVAS_HEIGHT / 3,
            'YOU LOOSE',
            'white',
            ctx
          );
          // const table = new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black', ctx);
          // table.drawRect();
          playerMsg.drawText();
        }
      }
    }
  }, [frame]);
  //*draw

  useEffect(() => {
    if (users.length) {
      setLeftPlayer(users[0]);
      setRightPlayer(users[1]);
      console.log(leftPlayer?.id + '------------------' + rightPlayer?.id);
    }
  }, [users]);

  return (
    <div className='flex w-full flex-col items-center relative'>
      <div
        ref={playBtnsRef}
        className='flex md:flex-row flex-col items-center justify-between mt-44 md:w-[50rem] absolute'
      >
        <div className='button'>
          {/* <a>Mobile First</a> */}
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
      {
        <div className='relative'>
          <div>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            ></canvas>
          </div>
          <div className='absolute mb-26 text-white'>
            <button type='button'>Play Again</button>
          </div>
        </div>
      }
      <div className=''>
        {users.length && (
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
          // <div className='w-[60rem] h-[7rem] m-6 flex justify-between items-center'>
          //   <div className='bg-red-200 h-[7rem] w-1/2 flex items-center justify-between '>
          //     <div className='flex items-center'>
          //       <img
          //         src={leftPlayer?.avatar_url}
          //         className='w-20 h-20 rounded-full m-4 ml-5'
          //       />
          //     </div>
          //   </div>
          //   <div className='bg-purple-700 h-[7rem] w-1/2 flex items-center justify-between '>
          //     <div className='flex items-center'>
          //       <img
          //         src={rightPlayer?.avatar_url}
          //         className='w-20 h-20 rounded-full m-4 mr-5'
          //       />
          //     </div>
          //   </div>
          // </div>
        )}
      </div>
    </div>
  );
};

export default Pong;

//* Done: show the score on the screen
//* Done: stop the game when a score reaches the max score

//TODO: show the uttons only if the userType is a player
//TODO: set winner and looser
//TODO: play and pause //! makainax f subject
//TODO: add this color to the game after the UI finished: #05f2db
//TODO: add game over in the end of the game and the winner for the winner and loser for the looser
//TODO: add Live Games page and update it every little bit by listening on a socket every 1s or so
