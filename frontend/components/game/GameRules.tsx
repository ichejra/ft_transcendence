import React from 'react'

const GameRules = () => {
  return (
    <div className='text-black'>
      <h1 className='title-family text-opacity-80 md:text-2xl text-xl pb-6 sm:text-start'>
        HOW TO PLAY PONG?
      </h1>
      <ol className='md:pl-10 sm:text-start'>
        <li>
          <span className='title-family'>1</span>- GAME IS PLAYED TO 10 POINTS.
        </li>
        <li>
          <span className='title-family'>2</span>- RANDOM SERVES.
        </li>
        <li>
          <span className='title-family'>3</span>- USE THE PADDLE TO HIT THE
          BALL BACK AND FORTH.
        </li>
        <li>
          <span className='title-family'>4</span>- USE{' '}
          {String.fromCharCode(9650)} AND {String.fromCharCode(9660)} TO MOVE
          THE PADDLE UP AND DOWN.
        </li>
        <li>
          <span className='title-family'>5</span>- YOU GET A POINT ONCE YOUR
          OPPONENT MISSES A BALL.
        </li>
        <li>
          <span className='title-family'>6</span>- IF YOU LEAVE THE GAME
          UNEXPECTEDLY, YOUR OPPONENT WINS 10 - 0.
        </li>
      </ol>
    </div>
  );
}

export default GameRules

//TODO style the numbers with retro
//TODO HIDE the rules
//TODO remove the player from the queue if it was on another
//TODO add image 
