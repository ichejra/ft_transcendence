// import { SiLinkedin } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa';
// import { FiGithub } from 'react-icons/fi';
import { GoMarkGithub } from 'react-icons/go';
// import { SiTwitter } from 'react-icons/si';
// import { CgTwitter } from 'react-icons/cg';
import { FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className='page-100 bg-yellow-500'>
      <div className='pt-5'>
        {/* <div className='flex flex-col md:flex-row items-center'> */}
        <div className='flex  md:flex-row flex-col-reverse items-center bg-black'>
          {/* <p className='text-center text-xl font-mono m-4 md:w-1/2'> */}
          <p className='md:text-xl text-yellow-400 font-mono m-4 w-full md:px-4 p-6 text-md text-center'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio
            sapiente dicta inventore corrupti! Recusandae, omnis eligendi cum
            quidem laboriosam magni odio culpa maiores? Magni.
          </p>
          <img
            src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/056cdb109881021.5fddf7261f9f5.gif'
            className='md:w-1/2 md:h-1/2 md:py-16 md:pr-16 w-full h-full py-6 p-8 md:max-w-xl'
          />
        </div>
      </div>
      <div>
        <p className='md:mt-32 mt-14 mb-4 text-center font-medium  md:text-4xl text-2xl tracking-[.15em] font-mono'>
          About Us
        </p>

        <div className='md:p-20 md:pt-0 flex items-center justify-center flex-col md:flex-row'>
          <div className='md:p-20 md:pt-12 p-4'>
            <img
              src='https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2360&q=80'
              alt=''
              className='md:w-[16rem] md:h-[12rem] rounded-full w-64 h-64 lg:w-64 lg:h-64'
            />
            <p className='text-center m-2 font-medium lg:text-xl md:text-lg text-base font-mono'>
              Full Name
              <br />
              <span className='text-sm opacity-75'>Role</span>
            </p>
            <p className='flex justify-center'>
              <Link to='#'>
                <FaTwitter
                  className='mr-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100 '
                  size='1.3rem'
                />
              </Link>
              <Link to='#'>
                <FaLinkedinIn
                  className='ml-1.5 mr-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100'
                  size='1.37rem'
                />
              </Link>
              <Link to='#'>
                <GoMarkGithub
                  className='ml-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100'
                  size='1.4rem'
                />
              </Link>
            </p>
          </div>
          <div className='md:p-20 md:pt-12 p-4'>
            <img
              src='https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80'
              alt=''
              className='md:w-[16rem] md:h-[12rem] rounded-full w-64 h-64 lg:w-64 lg:h-64'
              // className='md:w-64 md:h-64 rounded-full w-32 h-28'
            />
            <p className='text-center m-2 font-medium lg:text-xl md:text-lg text-base font-mono'>
              Full Name
              <br />
              <span className='text-sm opacity-75'>Role</span>
            </p>
            <p className='flex justify-center'>
              <Link to='#'>
                <FaTwitter
                  className='mr-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100'
                  size='1.3rem'
                />
              </Link>
              <Link to='#'>
                <FaLinkedinIn
                  className='ml-1.5 mr-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100'
                  size='1.37rem'
                />
              </Link>
              <Link to='#'>
                <GoMarkGithub
                  className='ml-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100'
                  size='1.4rem'
                />
              </Link>
            </p>
          </div>
          <div className='md:p-20 md:pt-12 p-4'>
            <img
              src='https://images.unsplash.com/photo-1623685462430-c485d0f6cd29?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2293&q=80'
              alt=''
              className='md:w-[16rem] md:h-[12rem] rounded-full w-64 h-64 lg:w-64 lg:h-64'
            />
            <p className='text-center m-2 font-medium lg:text-xl md:text-lg text-base font-mono'>
              Full Name
              <br />
              <span className='text-sm opacity-75'>Role</span>
              <br />
            </p>
            <p className='flex justify-center'>
              <Link to='#'>
                <FaTwitter
                  // className='mr-1.5 cursor-pointer w-5 hover:text-gray-600'
                  className='mr-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100'
                  size='1.3rem'
                />
              </Link>
              <Link to='#'>
                <FaLinkedinIn
                  className='ml-1.5 mr-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100'
                  size='1.37rem'
                />
              </Link>
              <Link to='#'>
                <GoMarkGithub
                  className='ml-1.5 cursor-pointer w-5 opacity-75 hover:opacity-100'
                  size='1.4rem'
                />
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className='text-center md:p-20 py-20'>
        <p className='md:text-3xl font-medium font-mono'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio
        </p>
        <button
          className='md:text-xl font-bold bg-black text-yellow-400 w-52 p-2 rounded-lg m-4 tracking-wider hover:scale-125
        transition ease-in-out duration-200'
        >
          Play Now!
        </button>
      </div>
      {/* <div className='pb-5'>
        <div className='text-center md:p-20 py-20 bg-black'>
          <p className='md:text-3xl font-medium font-mono text-yellow-400 px-3'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <button
            className='md:text-xl font-bold bg-yellow-500 text-black w-52 p-2 rounded-lg m-4 tracking-wider hover:scale-125
          transition ease-in-out duration-200'
          >
            Play Now!
          </button>
        </div>
      </div> */}
    </div>
  );
};

// return (
//   <div className='page-100 flex justify-center text-yellow-400'>
//     <div className='screen-bg flex bg-black justify-center items-center'>
//       <div className=' h-full flex flex-col justify-center items-center'>
//         <h1 className='text-7xl font-bold m-4'>Ping Pong</h1>
//         <p className='text-center text-2xl font-noraml m-4 md:w-1/2'>
//           Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio
//           sapiente dicta inventore corrupti! Recusandae, omnis eligendi cum
//           quidem laboriosam magni odio culpa maiores? Magni.
//         </p>
//         <div>
//           <button className='text-xl font-bold bg-yellow-400 text-gray-800 w-48 p-2 rounded-lg m-4'>
//             Play Now!
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );
//"Inconsolata",monospace "Montserrat",sans-serif
//! try gray bg color maybe it can work

export default AboutPage;
