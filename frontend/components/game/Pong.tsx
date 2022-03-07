import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';


const socket = io('http://localhost:3000');

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const PAD_HEIGHT = 100;
const PAD_WIDTH = 10;
const L_PADX = 0;
const R_PADX = CANVAS_WIDTH - PAD_WIDTH;
const PADY_INIT = CANVAS_HEIGHT / 2 - PAD_HEIGHT / 2;


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

class Paddle extends Rect {}
class Ball extends Circle {}




const Pong = () => {
  const canvasRef = useRef(null);
  const stateInit = {
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
    },
    paddles: {
      leftPad: PADY_INIT,
      rightPad: PADY_INIT,
    },
    score: {
      player1: 0,
      player2: 0,
    },
  };
  const [frame, setFrame] = useState(stateInit);
  const joinMatch = () => {
    socket.emit('join_queue', 'default');
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  }, [draw]);
  //*draw
  const table = new Rect(0, 0, 1000, 600, 'black', ctx);
  table.drawRect();
  const paddle1 = new Paddle(0);
  paddle1.drawRect();
  const paddle2 = new Paddle();
  paddle2.drawRect();
  const ball = new Ball(render.ball.x, render.ball.y, 12, 'white', ctx);
  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <button onClick={startPlaying}>Play Now</button>
    </div>
  );
};

export default Pong;







