import Link from "next/link";

const LandingPage: React.FC = () => {
  return (
    <div className="page-100 flex justify-center text-yellow-400">
      <div className="screen-bg flex bg-black justify-center items-center">
        <div className=" h-full flex flex-col justify-center items-center">
          <h1 className="text-7xl font-bold m-4">Ping Pong</h1>
          <p className="text-center text-2xl font-noraml m-4 md:w-1/2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio
            sapiente dicta inventore corrupti! Recusandae, omnis eligendi cum
            quidem laboriosam magni odio culpa maiores? Magni.
          </p>
          <div>
            <Link href="/auth">
              <button className="text-xl font-bold bg-yellow-400 text-gray-800 w-48 p-2 rounded-lg m-4">
                Play Now !
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
