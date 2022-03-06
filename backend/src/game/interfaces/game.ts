import { Socket } from 'socket.io';
import Consts from '../game_consts';
import Paddle from './paddle';
import Ball from './ball';
import Player from './player';



class GameObj {
  private _id: string;
  private _player1: Player;
  private _player2: Player;
  private _ball: Ball;
  private _spectators: Socket[] = [];

  constructor(player1: Player, player2: Player /* , type mn b3d */) {
    this._player1 = player1;
    this._player2 = player2;
    this._ball  = new Ball();
  }

  public resetGame() : void {
    this._ball.resetBall();
    this._player1.reset();
    this._player2.reset();
  }

  public getId() : string {
    return this._id;
  }

  // * add watchers


}

