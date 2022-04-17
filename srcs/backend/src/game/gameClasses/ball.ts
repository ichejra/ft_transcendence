import { Consts } from '../constants/gameConsts';
import Paddle from './paddle';

class Ball {
  private _x: number;
  private _y: number;
  private _velocityX: number;
  private _velocityY: number;
  private _speed: number;

  constructor() {
    this._x = Consts.CANVAS_W / 2;
    this._y = Consts.CANVAS_H / 2;
    this._speed = Consts.BALL_SPEED;
    this._velocityX = Consts.BALL_SPEED * this._getRandomDirection();
    this._velocityY = Consts.BALL_SPEED * this._getRandomDirection();
  }

  //* Move ball
  public moveBall(): void {
    this._x += this._velocityX;
    this._y += this._velocityY;
  }

  //* Random serves
  private _getRandomDirection(): number {
    const rand = Math.floor(Math.random() * 1337);
    if (rand % 2 == 0) return -1;
    return 1;
  }

  //* reset ball
  public resetBall = () => {
    this._x = Consts.CANVAS_W / 2;
    this._y = Consts.CANVAS_H / 2;
    this._speed = Consts.BALL_SPEED;
    this._velocityX = Consts.BALL_SPEED * this._getRandomDirection();
    this._velocityY = Consts.BALL_SPEED * this._getRandomDirection();
  };

  //* bounce when it hits the top and bottom borders
  ballHorizontalBounce(): void {
    if (
      this._y + Consts.BALL_RADIUS >= Consts.CANVAS_H ||
      this._y - Consts.BALL_RADIUS <= 0
    ) {
      // * checking if the ball hits the border
      this._velocityY = -this._velocityY;
    }
  }

  //* check ball and paddle collision
  PaddleBallCollision = (paddle: Paddle) => {
    //* paddles coordinates
    const paddleTop = paddle.getY();
    const paddleBottom = paddle.getY() + Consts.PADDLE_H;
    const paddleLeft = paddle.getX();
    const paddleRight = paddle.getX() + Consts.PADDLE_W;
    //* ball coordinates
    const ballTop = this._y - Consts.BALL_RADIUS;
    const ballBottom = this._y + Consts.BALL_RADIUS;
    const ballLeft = this._x - Consts.BALL_RADIUS;
    const ballRight = this._x + Consts.BALL_RADIUS;

    return (
      paddleLeft < ballRight &&
      paddleTop < ballBottom &&
      paddleRight > ballLeft &&
      paddleBottom > ballTop
    );
  };

  //* getters and setters
  public getX(): number {
    return this._x;
  }

  public getY(): number {
    return this._y;
  }
  public setVelocityX(velocityX: number): void {
    this._velocityX = velocityX;
  }

  public setVelocityY(velocityY: number): void {
    this._velocityY = velocityY;
  }

  public getVelocityX(): number {
    return this._velocityX;
  }

  public getVelocityY(): number {
    return this._velocityY;
  }

  public getSpeed(): number {
    return this._speed;
  }

  public setSpeed(newSpeed: number): void {
    if (this._speed < Consts.BALL_MAX_SPEED) this._speed = newSpeed;
  }
}

export default Ball;
