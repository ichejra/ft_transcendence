import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  reconnectionDelayMax: 10000,
  auth: {
    token: '123',
  },
  query: {
    'my-key': 'my-value',
  },
});

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
  constructor(
    x: number,
    y: number,
    r: number,
    color: string,
    ctx: any
  ) {
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

class Ball extends Circle {
  
}
class Paddle extends Rect {

}


const Pong = () => {
  const canvasRef = useRef(null);
  const [render, setRender] = useState({
    ball: {x: 0, y:0},
    paddle1: {x: 0,y:600/2},
    paddle2: {x:1000-15,y:600/2},
    // ball: {x: 0, y:0},
  });
  const startPlaying = () => {
    socket.emit('join_game', () => {})
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  }, [draw]);
  //*draw
  const table = new Rect(0, 0, 1000, 600, 'black', ctx);
  table.drawRect();
  const paddle1 = new Paddle(0, );
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
