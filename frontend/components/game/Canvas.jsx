import React, { useRef, useEffect } from 'react';

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const { draw, ...rest } = props;
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
      console.log('Font loaded');
    });
    const render = () => {
      draw(ctx);
      // animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    // return () => window.cancelAnimationFrame(animationFrameId);
  }, [draw]);
  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
