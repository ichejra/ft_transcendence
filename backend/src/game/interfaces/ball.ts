import { Socket } from 'socket.io';
import Consts from '../game_consts';
import Paddle from './paddle';

class Ball {
  private _x: number;
  private _y: number;
  private _velocityX: number;
  private _velocityY: number;
  private _speed: number;
  private _score: number;

  constructor() {
    this._x = Consts.CANVAS_W / 2;
    this._y = Consts.CANVAS_H / 2;
    this._speed = Consts.BALL_SPEED;
    this._velocityX = Consts.BALL_SPEED * this._getRandomDirection();
    this._velocityY = Consts.BALL_SPEED * this._getRandomDirection();
  }

  public moveBall(): void {
    this._x += this._velocityX;
    this._y += this._velocityY;
    //! in case
    // if (
    //   ball.y - ball.radius >= ctx.canvas.height ||
    //   ball.y + ball.radius <= 0
    // )
    //   ball.y -= ball.velocityY;
  }
  private _getRandomDirection(): number {
    const rand =  Math.floor(Math.random() * 1337) ;
    // console.log(rand);
    
    if (rand % 2 == 0) return -1;
    return 1;
  }


  public resetBall = () => {
    this._x = Consts.CANVAS_W / 2;
    this._y = Consts.CANVAS_H / 2;
    this._speed = Consts.BALL_SPEED;
    this._velocityX = Consts.BALL_SPEED * this._getRandomDirection();
    this._velocityY = Consts.BALL_SPEED * this._getRandomDirection();
  };

  ballHorizontalBounce(): void {
    if (
      this._y + Consts.BALL_RADIUS >= Consts.CANVAS_H ||
      this._y - Consts.BALL_RADIUS <= 0
    ) {
      // ! checking if the ball hits the border
      this._velocityY = -this._velocityY;
      // console.log('ball: ',this._y);
    }
  }
  PaddleBallCollision = (paddle: Paddle) => {
    const paddleTop = paddle.getY();
    const paddleBottom = paddle.getY() + Consts.PADDLE_H;
    const paddleLeft = paddle.getX();
    const paddleRight = paddle.getX() + Consts.PADDLE_W;

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

  public getX(): number {
    return this._x;
  }
  public getY(): number {
    return this._y;
  }
  public setVelocityX(velocityX: number): void {
    this._velocityX = velocityX;
    // console.log('veloX ', this._velocityX);
    
  }
  public setVelocityY(velocityY: number): void {
    this._velocityY = velocityY;
    // console.log('veloY ', this._velocityY);
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
  public setSpeed(newSpeed : number): void {
    this._speed = newSpeed;
  }
}

export default Ball;
