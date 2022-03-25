import React from 'react'

const GameRules = () => {
  return (
    <div className='text-gray-200  border-4 border-[lightgrey]  md:w-3/4 w-11/12 cursor-default'>
      <h1 className='title-family text-opacity-80 md:text-2xl text-xl pb-6 sm:text-start p-10 pl-0 underline underline-offset-4'>
        HOW TO PLAY PONG?
      </h1>
      <ol className='sm:text-start pb-10 px-6 md:text-xl text-sm rules-font'>
        <li className='hover:bg-[lightgrey] hover:text-black'>
          <span className='title-family'>1</span>- GAME IS PLAYED TO 10 POINTS.
        </li>
        <li className='hover:bg-[lightgrey] hover:text-black'>
          <span className='title-family'>2</span>- RANDOM SERVES.
        </li>
        <li className='hover:bg-[lightgrey] hover:text-black'>
          <span className='title-family'>3</span>- USE THE PADDLE TO HIT THE
          BALL BACK AND FORTH.
        </li>
        <li className='hover:bg-[lightgrey] hover:text-black'>
          <span className='title-family'>4</span>- USE{' '}
          {String.fromCharCode(9650)} AND {String.fromCharCode(9660)} TO MOVE
          THE PADDLE UP AND DOWN.
        </li>
        <li className='hover:bg-[lightgrey] hover:text-black'>
          <span className='title-family'>5</span>- YOU GET A POINT ONCE YOUR
          OPPONENT MISSES A BALL.
        </li>
        <li className='hover:bg-[lightgrey] hover:text-black'>
          <span className='title-family'>6</span>- IF YOU LEAVE THE GAME
          UNEXPECTEDLY, YOUR OPPONENT WINS [10 - 0].
        </li>
      </ol>
    </div>
  );
}

export default GameRules



//TODO remove the player from the queue if it was on another

