import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <div className="p-6 bg-black bg-opacity-75 flex items-center justify-center text-white">
      <h3 className="font-mono">Copyright &copy; {new Date().getFullYear()}</h3>
      <div className="cursor-pointer text-xl text-yellow-500 font-bold ml-4">
        <Link to="/">LOGO</Link>
      </div>
    </div>
  );
};

export default Footer;
