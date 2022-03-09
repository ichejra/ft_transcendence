import { Socket } from 'socket.io';
import Consts from '../game_consts';

class Paddle {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public getX(): number {
    return this._x;
  }
  public getY(): number {
    return this._y;
  }
  public setY(newPos : number) : void {
    this._y = newPos;
  }

  //* move the paddle
  public move_forward() {
    this._y += Consts.PADDLE_DIFF;
  }
  public backward() {
    this._y -= Consts.PADDLE_DIFF;
  }
}

export default Paddle;
