import React, { useRef, useEffect } from 'react';

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const { draw, update, user, ...rest } = props;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 1000;
    ctx.canvas.height = 600;
    let animationFrameId;
    const f = new FontFace(
      'Caesar Dressing',
      'url(https://fonts.gstatic.com/s/caesardressing/v19/yYLx0hLa3vawqtwdswbotmK4vrRHdrz7D5h9yw.woff2)'
    );
    f.load().then((font) => {
      document.fonts.add(font);
      // console.log('Font loaded');
    });
    const movePaddle = (e) => {
      let rect = ctx.canvas.getBoundingClientRect();
      if (e.clientY >= ctx.canvas.height - user.height + rect.top) {
        user.y = ctx.canvas.height - user.height;
      } else {
        user.y = e.clientY - rect.top;
      }
      // console.log('rect' , rect);
    };
    const render = () => {
      update(ctx);
      draw(ctx);
      // animationFrameId = window.requestAnimationFrame(render);
    };
    canvas.addEventListener('mousemove', movePaddle);
    render();
    // const timer = setInterval(render, 1000 / 50);
    // return () => {clearInterval(timer);};
  }, [draw]);
  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
