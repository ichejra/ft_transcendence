
import { User } from '../../features/userProfileSlice';

//* canvas resolutions
const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 1000;

//* ball resolutions and coordinates
const B_RADIUS = 12;
const BALL_INIT_X = CANVAS_WIDTH / 2;
const BALL_INIT_Y = CANVAS_HEIGHT / 2;
const BALL_SPEED = 6;
const BALL_MAX_SPEED = 15;

//* paddles resolutions and coordinates
const PAD_WIDTH = 15;
const PAD_HEIGHT = 100;
const PADDLE_DIFF = 10;
const L_PADX = 0 + 20;
const R_PADX = CANVAS_WIDTH - PAD_WIDTH - 20;
const PADY_INIT = CANVAS_HEIGHT / 2 - PAD_HEIGHT / 2;

//* net resolutions and coordinates
const NET_W = 5;
const NET_H = 10;
const NETX = CANVAS_WIDTH / 2 - NET_W / 2;
const NETY = 0;

const MAX_SCORE = 10;
const MAX_WATCHERS = 10;

export class Rect {
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

export class Circle {
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

export class Text {
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
    this._ctx.font = "32px 'Press Start 2P'";
    this._ctx.fillText(this._text, this._x, this._y);
  }
}

export interface IFrame {
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

export {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_SCORE,
  MAX_WATCHERS,
  B_RADIUS,
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
};
