import { useEffect } from 'react';
import Canvas from './Canvas.jsx';

interface User {
  x: number;
  y: number; //100 is the height
  width: number;
  height: number;
  color: string;
  score: number;
}

const PongGame = () => {
  const user: User = {
    x: 0,
    y: 600 / 2 - 100 / 2, //100 is the height
    width: 10,
    height: 100,
    color: 'white',
    score: 0,
  };
  const comp = {
    x: 1000 - 10, //10 is the width
    y: 600 / 2 - 100 / 2, //100 is the height
    width: 10,
    height: 100,
    color: 'white',
    score: 0,
  };

  function drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    ctx: any
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  const drawText = (
    text: number,
    x: number,
    y: number,
    color: string,
    ctx: any
  ) => {
    ctx.fillStyle = color;
    // ctx.
    ctx.font = '45px Caesar Dressing'; //Barrio, Aclonica, Caesar Dressing
    ctx.fillText(text, x, y);
  };

  const net = {
    x: 1000 / 2 - 2 / 2, //first 2 is the width
    y: 0,
    width: 2,
    height: 10,
    color: 'white',
  };

  const drawNet = (ctx: any) => {
    for (let i = 0; i <= ctx.canvas.width; i += 15) {
      drawRect(net.x, net.y + i, net.width, net.height, net.color, ctx);
    }
  };

  const ball = {
    x: 1000 / 2,
    y: 600 / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5, // velocityY= speed + direction
    color: 'white',
  };
  const drawCircle = (
    x: number,
    y: number,
    r: number,
    color: string,
    ctx: any
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false); //? r: radius, false: direction of the drawing will be clockwise, 0: start Angle, Math.PI*2: end angle
    ctx.closePath();
    ctx.fill();
  };

  const draw = (ctx: any) => {
    // * clear the canvas
    drawRect(0, 0, ctx.canvas.width, ctx.canvas.height, '#000033', ctx);
    //* draw the score
    drawText(
      user.score,
      ctx.canvas.width / 4,
      ctx.canvas.height / 5,
      'white',
      ctx
    );
    drawText(
      comp.score,
      (3 * ctx.canvas.width) / 4,
      ctx.canvas.height / 5,
      'white',
      ctx
    );
    // //* draw the net
    drawNet(ctx);

    // //* draw the paddles
    drawRect(user.x, user.y, user.width, user.height, user.color, ctx);
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.color, ctx);
    // //* draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color, ctx);
  };

  return (
    <div className='page-100 flex items-center justify-center'>
      {/* <h1 className="text-2xl">PING PONG</h1> */}
      <Canvas draw={draw} />
    </div>
  );
};

export default PongGame;
