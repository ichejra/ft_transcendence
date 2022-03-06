import { Socket } from 'socket.io';
import Consts from '../game_consts';

class Paddle {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public getX() {
    return this._x;
  }
  public getY() {
    return this._y;
  }

  //* move the paddle



}

export default Paddle;
