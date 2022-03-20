import { Socket } from 'socket.io';
import { Consts, GameStates } from '../game_consts';

class Paddle {
  private _x: number;
  private _y: number;
  private _height: number;
  private _width: number;
  private _padSpeed: number;

  constructor(x: number) {
    this._x = x;
    this._y = Consts.PADDLE_INIT_Y;
    this._padSpeed = 0;
    this._height = Consts.PADDLE_H;
    this._width = Consts.PADDLE_W;
    
  }

  public getX(): number {
    return this._x;
  }
  public getY(): number {
    return this._y;
  }
  public getHeight(): number {
    return this._height;
  }
  public getWidth(): number {
    return this._width;
  }
  public setHeight(newHeight: number): void {
    this._height = newHeight;
  }
  public setWidth(newWidth: number): void {
    this._width = newWidth;
  }

  public setY(newPos: number): void {
    this._y = newPos;
  }
  public getPadSpeed(): number {
    return this._padSpeed;
  }
  public setPadSpeed(pad_speed: number): void {
    this._padSpeed = pad_speed;
  }

  //* move the paddle
  public movePaddle() {
    if (this._padSpeed === 0) return;
    this._y += this._padSpeed;
    if (this._y + this._height > Consts.CANVAS_H) {
      this._padSpeed = 0;
      this._y = Consts.CANVAS_H - this._height;
      return;
    }
    if (this._y <= 0) {
      this._padSpeed = 0;
      this._y = 0;
      return;
    }
    // if (this._padSpeed === 0) return;
    // this._y += this._padSpeed;
    // if (this._y + Consts.PADDLE_H > Consts.CANVAS_H) {
    //   this._padSpeed = 0;
    //   this._y = Consts.CANVAS_H - Consts.PADDLE_H;
    //   return;
    // }
    // if (this._y <= 0) {
    //   this._padSpeed = 0;
    //   this._y = 0;
    //   return;
    // }
  }

  public isLeft() {
    return this._x - Consts.PADDLE_W <= 0;
  }
  public resetPaddle(): void {
    // this._y = Consts.PADDLE_INIT_Y;
    //TODO reset Length too later
    this._height = Consts.PADDLE_H;
    this._width = Consts.PADDLE_W;
  }

  public move_forward(key: string): void {
    if (key === 'down') {
      this._padSpeed = -Consts.PADDLE_DIFF;
    } else {
      this._padSpeed = 0;
    }
  }

  public move_backward(key: string): void {
    if (key === 'down') {
      this._padSpeed = Consts.PADDLE_DIFF;
    } else {
      this._padSpeed = 0;
    }
  }
}

export default Paddle;
