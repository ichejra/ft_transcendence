import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { User } from '../../features/userProfileSlice';
import { socket } from '../../pages/SocketProvider';

interface IFrame {
  players: {
    player1: User;
    player2: User;
  };
  score: {
    score1: number;
    score2: number;
  };
}

const LiveGames = () => {
  // console.log('I am from live games');
  const [frame, setFrame] = useState<IFrame[]>([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const watchGame = (id: number) => {
    console.log("id ======= ", id);
    socket.emit('spectator', id);
    navigate('/watch');
  };
  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    socket.emit('liveGames');
    delay(1000).then(() => {
      setRefresh(!refresh);
    });
  }, [refresh]);

  useEffect(() => {
    socket.on('liveGame_state', (newState) => {
      setFrame(newState);
    });
    return () => {
      socket.off('liveGame_state');
    };
  });

  return (
    <div className=' page-100 mt-20 flex w-full flex-col items-center text-white '>
      <div className='my-8'>
        {frame.map((item, index) => {
          const {
            players: { player1, player2 },
            score: { score1, score2 },
          } = item;
          return (
            <div
              key={index}
              className='w-[40rem] h-[7rem] bg-black m-6 flex justify-between items-center'
            >
              <div className=' bg-black h-[7rem] w-1/2 flex items-center justify-between relative'>
                <div className='livegame-left-paddle'></div>
                <div className='flex items-center'>
                  <img
                    src={player1.avatar_url}
                    className='w-20 h-20 rounded-full m-4 ml-5'
                  />
                  <h1 className='about-family text-[16px] '>
                    {player1.user_name.slice(0, 6)}
                  </h1>
                </div>
                <div className='mr-4 game-family text-[32px] font-bold'>
                  {score1}
                </div>
              </div>
              <div className='flex p-2 text-center relative h-[7rem] w-48'>
                <div className='livegame-net'></div>
                <div className='hover:scale-110 h-4'>
                  <button
                    className='bg-none game-family rounded text-[20px]'
                    onClick={() => {
                      watchGame(player1.id);
                    }}
                  >
                    Watch Game
                  </button>
                </div>
              </div>
              <div className=' bg-black h-[7rem] w-1/2 flex items-center justify-between relative'>
                <div className='ml-4 game-family text-[32px] font-bold'>
                  {score2}
                </div>
                <div className='flex items-center'>
                  <h1 className='about-family text-[16px]'>
                    {player2.user_name.slice(0, 6)}
                  </h1>
                  <img
                    src={player2.avatar_url}
                    className='w-20 h-20 rounded-full m-4 mr-5'
                  />
                </div>
                <div className='livegame-right-paddle'></div>
              </div>
            </div>
          );
        })}
        {/* {Array.from({ length: 10 }).map((item, index) => {
          
          return (
            <div
              key={index}
              className='w-[40rem] h-[7rem] bg-black m-6 flex justify-between items-center'
              onClick={() => {
                // watchGame(player1.id);
              }}
            >
              <div className=' bg-black h-[6rem] w-1/2 flex items-center justify-between relative'>
                <div className='livegame-left-paddle'></div>
                <div className='flex items-center'>
                  <img
                    src='/images/profile.jpeg'
                    className='w-20 h-20 rounded-full m-4 ml-5'
                  />
                  <h1 className='about-family text-[16px] '>NAME</h1>
                </div>
                <div className='mr-4 game-family text-[32px] font-bold'>10</div>
              </div>
              <div className='flex p-2 text-center relative h-[7rem] w-48'>
                <div className='livegame-net'></div>
                <div className='hover:scale-110 h-4'>
                  <button className='bg-none game-family rounded text-[20px]'>
                    Watch Game
                  </button>
                </div>
              </div>
              <div className=' bg-black h-[6rem] w-1/2 flex items-center justify-between relative'>
                <div className='ml-4 game-family text-[32px] font-bold'>10</div>
                <div className='flex items-center'>
                  <h1 className='about-family text-[16px]'>NAME</h1>
                  <img
                    src='/images/profile.jpeg'
                    className='w-20 h-20 rounded-full m-4 mr-5'
                  />
                </div>
                <div className='livegame-right-paddle'></div>
              </div>
            </div>
          );
        })} */}
        {/* {frame.map((item, index) => {
          const {
            players: { player1, player2 },
            score: { score1, score2 },
          } = item;
          console.log(item);
          return (
            <div
              key={index}
              className='w-[40rem] h-[6rem] flex bg-red-300 m-2 onClick={wacthGame}'
            >
              <div className='bg-blue-200 h-[6rem] w-1/2'>
                <div>
                  <img src={player1.avatar_url} alt='' className='w-32' />
                  <div>{score1}</div>
                </div>
              </div>
              <div className='bg-green-200 h-[6rem] w-1/2'>
                <div>
                  <div>{score2}</div>
                  <img src={player2.avatar_url} alt='' className='w-32' />
                </div>
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default LiveGames;

//* DONE: make Watch game button work
//* DONE: set the length of the username to be static

//TODO: resposivity of live games page
