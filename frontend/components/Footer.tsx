import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <div className='p-6 bg-black bg-opacity-75 flex items-center justify-center text-white md:text-base text-sm'>
      <h3 className='font-mono opacity-70 '>
        Copyright &copy; {new Date().getFullYear()}. All rights reserved
      </h3>
      <div className='cursor-pointer text-xl text-yellow-500 font-bold ml-4'>
        <Link to='/'>LOGO</Link>
      </div>
    </div>
  );
};

export default Footer;
