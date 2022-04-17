import { Socket } from 'socket.io';
import { Consts } from '../constants/gameConsts';
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
    this._interval = setInterval(
      () => this._paddle.movePaddle(),
      1000 / Consts.framePerSec,
    );
  }

  //* check if score reaches the max score
  public checkScore(): boolean {
    if (this._score === Consts.MAX_SCORE) return true;
    return false;
  }

  //* increment score
  public incScore() {
    if (this.checkScore()) return;
    this._score++;
  }

  //* set the winner
  public isWinner(): boolean {
    return this.checkScore();
  }

  //* reset
  public reset(): void {
    this._score = 0;
  }

  //* clear interval for player
  public clearPlayer = () => {
    clearInterval(this._interval);
  };

  //* getters and setters
  public getSocket(): Socket {
    return this._socket;
  }
  public getIsLeft(): boolean {
    return this._isLeft;
  }
  public getScore(): number {
    return this._score;
  }
  public setScore(score: number): void {
    this._score = score;
  }
  public getPaddle(): Paddle {
    return this._paddle;
  }
}

export default Player;
