import { Socket } from "socket.io";
import Consts from '../game_consts';
import Paddle from './paddle';


class Player {
  private _socket: Socket;
  private _isLeft: boolean;
  private _paddle: Paddle;
  private _score: number;

  constructor(socket: Socket, isLeft: boolean) {
    this._socket = socket;
    this._isLeft = isLeft;
    this._score = 0;
  }

  public getSocket(): Socket {
    return this._socket;
  }
  public getIsLeft(): boolean {
    return this._isLeft;
  }
  public getScore(): number {
    return this._score;
  }
  public getPaddle(): Paddle {
    return this._paddle;
  }
  public incScore() {
    this._score++;
  }
  public isWinner(): boolean {
    if (this._score === Consts.MAX_SCORE) return true;
    return false;
  }
  public reset(): void {
    this._score = 0;
  }
}

export default Player;
