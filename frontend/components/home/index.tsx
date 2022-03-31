import { Link } from 'react-router-dom';
import Member from '../utils/TeamMember';
import { frameData } from '../../consts';
import { socket } from '../../pages/SocketProvider';
import { useAppSelector } from '../../app/hooks';

socket.emit('connection', () => {
  console.log('connected');
});

const HomePage: React.FC = () => {
  const { users, user: user_me } = useAppSelector((state) => state.user);

  const handleInvite = (id: number) => {
    console.log('invit sent to: ', id);

    socket.emit('invite_to_game', {
      inviter: user_me.id,
      invitee: id,
    });
  };
  
  return (
    <div className='w-full h-full  flex justify-center'>
      <div className='page-50 mt-20 flex bg-black w-full 2xl:w-[80rem] flex-col items-center'>
        <div className='hero-bg relative w-full 2xl:w-[80rem] flex items-center justify-between'>
          <div className='home-script'>
            <h1 className='home-title'>PING PONG</h1>
            <p className='home-quote'>Oldie But Goldie!</p>
            <Link to='/game'>
              <button className='hover:scale-110 transition duration-300 play-button'>
                PLAY NOW
              </button>
            </Link>
          </div>
          <img src='./images/heroSection.jpg' className='hero-img' />
        </div>
        <div className='flex flex-col lg:flex-row  w-full 2xl:w-[80rem] p-2 m-2 mt-20'>
          <div className='w-full lg:w-2/3'>
            <h1 className='title-family text-white text-opacity-80 text-2xl pb-4'>
              PONG
            </h1>
            <p className='text-family text-white text-opacity-80'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
              laborum expedita qui saepe voluptas. Eveniet facere aut explicabo
              amet illum, cum in sit veniam provident blanditiis ab a omnis
              consectetur.
            </p>
          </div>
          <div className='w-auto lg:w-1/3 relative mb-72 lg:mb-60 text-family pong-game'>
            <div className='left-paddle'></div>
            <div className='ball'></div>
            <div className='right-paddle'></div>
          </div>
        </div>
        <div className='flex flex-col w-full 2xl:w-[80rem] items-center about-section mb-32'>
          <h1 className='about-title-family text-white text-opacity-80 text-2xl pb-8'>
            About
          </h1>
          <p className='about-family text-center text-white text-opacity-80 w-3/4'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            voluptatibus placeat commodi aliquam temporibus quas exercitationem
            velit cupiditate ducimus aspernatur nisi a dolorem dolore, dolorum
            accusamus maxime et illo fugit!
          </p>
        </div>
        <div className='w-5/6 xl:w-3/6 mb-40'>
          <h1 className='about-title-family text-center text-white text-opacity-80 text-2xl pb-8'>
            Team
          </h1>
          <div className='flex md:flex-row flex-col md:space-y-0 space-y-4 justify-between items-center md:w-full'>
            {frameData.map((member, index) => {
              return <Member key={index} {...member} />;
            })}
          </div>
        </div>
        <div className='mb-32 flex flex-col items-center'>
          <h3 className='about-family text-white text-opacity-80 text-center'>
            Bring Back Old Memories With Old Friends
          </h3>

          {users
            .filter((user) => user.id != user_me.id)
            .map((user) => {
              const { id, user_name } = user;
              return (
                <button
                  key={id}
                  className='hover:scale-110 transition duration-300 play-button-bottom'
                  onClick={() => handleInvite(id)}
                >
                  Invite {user_name}
                </button>
              );
            })}
          <Link to='/game'>
            <button className='hover:scale-110 transition duration-300 play-button-bottom'>
              PLAY NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
