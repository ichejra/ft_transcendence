import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/game');

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const PAD_HEIGHT = 100;
const PAD_WIDTH = 10;
const BALL_RADIUS = 10;
const L_PADX = 0;
const R_PADX = CANVAS_WIDTH - PAD_WIDTH;
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

interface IFrame {
  ball: {
    x: number;
    y: number;
  };
  paddles: {
    leftPad: number;
    rightPad: number;
  };
  score: {
    score1: number;
    score2: number;
  };
}

class Paddle extends Rect {}
class Net extends Rect {}
class Ball extends Circle {}

const stateInit: IFrame = {
  ball: {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
  },
  paddles: {
    leftPad: PADY_INIT,
    rightPad: PADY_INIT,
  },
  score: {
    score1: 0,
    score2: 0,
  },
};

const Pong = () => {
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(stateInit);

  const joinMatch = () => {
    socket.emit('join_queue', 'default');
  };
  // const stopMatch = () => {
  //   socket.emit('stop_game', 'default');
  // };

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

  useEffect(() => {
    document.addEventListener('keydown', movePaddle);
    document.addEventListener('keyup', stopPaddle);
    socket.on('game_state', (newState) => {
      setFrame(newState);
      console.log('I am frame from front', frame.paddles.leftPad);
    });
    return () => {
      document.removeEventListener('keydown', movePaddle);
      document.removeEventListener('keyup', stopPaddle);
      socket.off('game_state');
    };
  }, []);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const table = new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black', ctx);
    table.drawRect();
    for (let i = 0; i <= ctx.canvas.width; i += 16) {
      const net = new Rect(NETX, NETY + i, NET_W, NET_H, 'white', ctx);
      net.drawRect();
    }
    const paddle1 = new Paddle(
      L_PADX,
      frame.paddles.leftPad,
      PAD_WIDTH,
      PAD_HEIGHT,
      'white',
      ctx
    );
    paddle1.drawRect();
    const paddle2 = new Paddle(
      R_PADX,
      frame.paddles.rightPad,
      PAD_WIDTH,
      PAD_HEIGHT,
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
  }, [frame]);
  //*draw
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      ></canvas>
      <button onClick={joinMatch}>Play Now</button>
      <br />
      <button onClick={stopMatch}>Stop Now</button>
    </div>
  );
};

export default Pong;
