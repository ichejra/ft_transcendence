import { Socket } from 'socket.io';
import Consts from '../game_consts';
import Paddle from './paddle';

class Player {
  private _socket: Socket;
  private _isLeft: boolean;
  private _paddle: Paddle;
  private _score: number;
  private _interval: NodeJS.Timer;

  constructor(socket: Socket, isLeft: boolean) {
    this._socket = socket;
    this._isLeft = isLeft;
    this._score = 0;
    this._paddle = isLeft
      ? new Paddle(Consts.L_PADDLE_X)
      : new Paddle(Consts.R_PADDLE_X);
    this._interval = setInterval(() => this._paddle.movePaddle(), 1000 / 60);
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
  public checkScore(): boolean {
    if (this._score === Consts.MAX_SCORE) return true;
    return false;
  }
  public incScore() {
    if (this.checkScore()) return;
    this._score++;
  }
  public isWinner(): boolean {
    return this.checkScore();
  }
  public reset(): void {
    this._score = 0;
  }
}

export default Player;
