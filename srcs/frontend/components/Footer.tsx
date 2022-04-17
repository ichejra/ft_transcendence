import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <div className="p-4 flex items-center justify-center user-card-bg text-gray-500 md:text-base text-sm">
      <h3 className="text-sm">
        Copyright &copy; {new Date().getFullYear()}. All rights reserved
      </h3>
      <div className="cursor-pointer text-xl text-yellow-500 font-bold ml-4">
        <Link to="/">
          <img
            src="./images/logo-ft-transcendence.png"
            alt="pong logo"
            className="w-16"
          />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
