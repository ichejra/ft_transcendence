import { useVelocity } from 'framer-motion';
import { useEffect, useState } from 'react';
import Canvas from './Canvas.jsx';
import { io } from 'socket.io-client';


//! ///////////////////////
// let ws = new WebSocket('ws://localhost:3001');


const socket = io('http://localhost:3000');



//! ///////////////////////

interface User {
  x: number;
  y: number; //100 is the height
  width: number;
  height: number;
  color: string;
  score: number;
}

const PongGame = () => {
  //! /////////////////////
  const [msg, setMsg] = useState('msg');

    const hello = 'hello';
    const message = document.getElementById('message');
    const messages = document.getElementById('messages');
    const handleSubmitNewMessage = () => {
      console.log();
      socket.emit('message', { data: msg });
    };
  
    socket.on('message', ({ data }) => {
      handleNewMessage(data);
    });
  
    const handleNewMessage = (message: string) => {
      messages?.appendChild(buildNewMessage(message));
    };
  
    const buildNewMessage = (msg: any) => {
      const li = document.createElement('li');
      li.appendChild(document.createTextNode(msg));
      return li;
    };

  //! /////////////////////
  const [tableColor, setTableColor] = useState('#000000');
  const [count, setCount] = useState(0);
  const user: User = {
    x: 1000 / 30,
    y: 600 / 2 - 100 / 2, //100 is the height
    width: 15,
    height: 100,
    color: 'white',
    score: 0,
  };
  const comp = {
    // x: (29 *1000/30) - 10, //10 is the width
    x: (29 * 1000) / 30 - 15, //10 is the width
    y: 600 / 2 - 100 / 2, //100 is the height
    width: 15,
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
    ctx.font = '45px Caesar Dressing'; //Barrio, Aclonica, Caesar Dressing
    ctx.fillText(text, x, y);
  };

  const net = {
    x: 1000 / 2 - 5 / 2, //first 2 is the width
    y: 0,
    width: 5,
    height: 10,
    color: 'white',
  };

  const drawNet = (ctx: any) => {
    for (let i = 0; i <= ctx.canvas.width; i += 15) {
      drawRect(net.x, net.y + i, net.width, net.height, net.color, ctx);
    }
  };

  const ball = {
    x: 1000,
    y: 600,
    radius: 12,
    speed: 10,
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
  const collision = (ball: any, player: any) => {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return (
      player.left < ball.right &&
      player.top < ball.bottom &&
      player.right > ball.left &&
      player.bottom > ball.top
    );
  };
  const resetBall = (ctx: any) => {
    ball.x = ctx.canvas.width / 2;
    ball.y = ctx.canvas.height / 2;
    ball.speed = 10;
    ball.velocityX = -ball.velocityX; // ! comment it out
    user.height = 100;
    comp.height = 100;
  };

  const update = (ctx: any) => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if (ball.y - ball.radius >= ctx.canvas.height || ball.y + ball.radius <= 0)
      ball.y -= ball.velocityY;

    // console.log("ball.y: ", ball.y);

    //! ///////////////////////////////////////////////////////////////////////
    // * do some AI to control the comp paddle
    let computerLevel = 0.1;
    comp.y += (ball.y - (comp.y + comp.height / 2)) * 0.1;
    //! ///////////////////////////////////////////////////////////////////////

    if (
      ball.y + ball.radius >= ctx.canvas.height ||
      ball.y - ball.radius <= 0
    ) {
      // ! checking if the ball hits the border
      ball.velocityY = -ball.velocityY;
      // console.log("VelocityY" ,ball.velocityY);
    }
    let player = ball.x + ball.radius < ctx.canvas.width / 2 ? user : comp;
    if (collision(ball, player)) {
      let collidePoint = ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction = ball.x + ball.radius < ctx.canvas.width / 2 ? 1 : -1;
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad); //! check direction
      // ball.speed += 0.2;
      if (player.height > 50) player.height -= 1;
      // console.log(ball.speed);
    }
    if (ball.x - ball.radius <= 0) {
      comp.score++;
      resetBall(ctx);
    } else if (ball.x + ball.radius >= ctx.canvas.width) {
      user.score++;
      resetBall(ctx);
    }
  };
  const draw = (ctx: any) => {
    drawRect(0, 0, ctx.canvas.width, ctx.canvas.height, tableColor, ctx);
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
    drawNet(ctx);

    drawRect(user.x, user.y, user.width, user.height, user.color, ctx);
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.color, ctx);
    drawCircle(ball.x, ball.y, ball.radius, ball.color, ctx);
  };
  const handleClick = () => {
    setCount(count + 1);
    // if (count === 0) setTableColor('#0818A8');
    // if (count === 0) setTableColor('#000080');
    // if (count === 0) setTableColor('#191970');
    // if (count === 0) setTableColor('#00008B'); //blue
    if (count === 0) setTableColor('#00A36C'); // green
    else if (count === 1) setTableColor('#fbb3c2'); // pink
    else if (count === 2) setTableColor('#FF59A1'); //pink
    else if (count === 3) setTableColor('#CD5C5C'); // pink
    else if (count == 4) {
      setCount(0);
      setTableColor('#000000');
    }
  };

  return (
    <div>
      <div className='page-100 flex items-center justify-center'>
        {/* <h1 className="text-2xl">PING PONG</h1> */}
        {/* <Canvas draw={draw} update={update} user={user} /> */}
      <ul id="messages">

      </ul>
      </div>
      <div>
        <input id="message" type="text" onChange={(e) => setMsg(e.target.value)}/>
        <button onClick={handleSubmitNewMessage}>submit</button>
      </div>
      <div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={handleClick}
        >
          Change Color
        </button>
      </div>
    </div>
  );
};












export default PongGame;