import { Socket } from 'socket.io';
import Consts from '../game_consts';

class Paddle {
  private _x: number;
  private _y: number;
  private _padSpeed: number;
  
  constructor(x: number) {
    this._x = x;
    this._y = Consts.PADDLE_INIT_Y;
    this._padSpeed = 0;
  }

  public getX(): number {
    return this._x;
  }
  public getY(): number {
    return this._y;
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
    console.log('mooooooove')
    this._y += this._padSpeed;
    if (this._y + Consts.PADDLE_H + Consts.PADDLE_W / 2 > Consts.CANVAS_H) {
      this._y = Consts.CANVAS_H - Consts.PADDLE_H - Consts.PADDLE_W / 2;
      this._padSpeed = 0;
      return;
    }
    if (this._y < Consts.PADDLE_W / 2) {
      this._y = Consts.PADDLE_W / 2;
      this._padSpeed = 0;
      return;
    }
  }

  //! public movePaddle() {
  //   // console.log('I am movePaddle')
  //   // let rect = ctx.canvas.getBoundingClientRect();
  //   // if (e.clientY >= ctx.canvas.height - user.height + rect.top) {
  //   //   user.y = ctx.canvas.height - user.height;
  //   // } else {
  //   //   user.y = e.clientY - rect.top;
  //   // }
  //   // console.log('rect' , rect);
  //   this._y += this._padSpeed;
  //   // console.log(this._y);
  //   if (this._y <= 0 || this._y + Consts.PADDLE_H >= Consts.CANVAS_H) {
  //     this._padSpeed = 0;
  //     return;
  //   }
  // }
  public isLeft() {
    return this._x - Consts.PADDLE_W <= 0;
  }
  public resetPaddle(): void {
    this._y = Consts.PADDLE_INIT_Y;
    //TODO reset Length too later
  }

  public move_forward(key: string): void {
    if (key === 'down') {
      this._padSpeed = -Consts.PADDLE_DIFF;
    } else {
      this._padSpeed = 0;
      console.log('speed ===== ', this._padSpeed);
    }
  }
  
  public move_backward(key: string): void {
    if (key === 'down') {
      this._padSpeed = Consts.PADDLE_DIFF;
    } else {
      this._padSpeed = 0;
      console.log('speed ===== ', this._padSpeed);
    }
  }
}

export default Paddle;
