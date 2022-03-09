import { Socket } from 'socket.io';
import Consts from '../game_consts';
import Paddle from './paddle';
import Ball from './ball';
import Player from './player';
import { Game } from '../entities/game.entity';

class GameObj {
  private _id: string;
  private _player1: Player;
  private _player2: Player;
  private _ball: Ball;
  private _spectators: Socket[] = [];
  private _interval: NodeJS.Timer;

  constructor(player1: Player, player2: Player /* , type mn b3d */) {
    this._player1 = player1;
    this._player2 = player2;
    this._ball = new Ball();
    this._interval = setInterval(() => this.playGame, 1000 / 60);
  }

  public resetGame(): void {
    this._ball.resetBall();
    this._player1.reset();
    this._player2.reset();
  }

  public getId(): string {
    return this._id;
  }

  public foundPlayerSocket(playerSocket: Socket) {
    return (
      this._player1.getSocket() === playerSocket || this._player2.getSocket()
    );
  }

  public getGamePlayer(playerSocket: Socket) : Player {
    return this._player1.getSocket() === playerSocket
          ? this._player1
          : this._player2;
  }

  // * add watchers

  public getPlayersSockets(): Socket[] {
    return [this._player1.getSocket(), this._player2.getSocket()];
  }
  public playGame(): void {
    if (this._ball.PaddleBallCollision(this._player1.getPaddle())) {
      let collidePoint =
        this._ball.getY() -
        (this._player1.getPaddle().getY() + Consts.PADDLE_H / 2);
      collidePoint = collidePoint / (Consts.PADDLE_H / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction =
        this._ball.getX() + Consts.BALL_RADIUS < Consts.CANVAS_W / 2 ? 1 : -1;
      this._ball.setValocityX(
        direction * this._ball.getSpeed() * Math.cos(angleRad),
      );
      this._ball.setValocityY(this._ball.getSpeed() * Math.sin(angleRad));
      // this._ball.setSpeed(this._ball.getSpeed() + 0.2);÷
      // * if this paddle height > 50, paddle.height--;
    }
    if (this._ball.PaddleBallCollision(this._player2.getPaddle())) {
      let collidePoint =
        this._ball.getY() -
        (this._player2.getPaddle().getY() + Consts.PADDLE_H / 2);
      collidePoint = collidePoint / (Consts.PADDLE_H / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction =
        this._ball.getX() + Consts.BALL_RADIUS < Consts.CANVAS_W / 2 ? 1 : -1;
      this._ball.setValocityX(
        direction * this._ball.getSpeed() * Math.cos(angleRad),
      );
      this._ball.setValocityY(this._ball.getSpeed() * Math.sin(angleRad));
      // this._ball.setSpeed(this._ball.getSpeed() + 0.2);÷
      // * if this paddle height > 50, paddle.height--;
    }
    if (this._ball.getX() - Consts.BALL_RADIUS <= 0) {
      this._player2.incScore();
      this._ball.resetBall();
    } else if (this._ball.getX() + Consts.BALL_RADIUS >= Consts.CANVAS_W) {
      this._player1.incScore();
      this._ball.resetBall();
    }
    this._player1.getSocket().emit('game_state', {
      ball: {
        x: this._ball.getX(),
        y: this._ball.getY(),
      },
      paddles: {
        leftPad: this._player1.getPaddle().getY(),
        rightPad: this._player2.getPaddle().getY(),
      },
      score: {
        player1: this._player1.getScore(),
        player2: this._player2.getScore(),
      },
    });
  }
}

export default GameObj;
