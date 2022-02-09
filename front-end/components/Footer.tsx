import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="p-6 bg-black bg-opacity-75 flex items-center justify-center text-white">
      <div className="cursor-pointer text-2xl text-yellow-500 font-bold mr-4">
        <Link href="/">LOGO</Link>
      </div>
      <h3 className="font-mono">
        Copyright &copy; {new Date().getFullYear()} PongWorld
      </h3>
    </div>
  );
};

export default Footer;
