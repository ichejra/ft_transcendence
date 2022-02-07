import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <div>
      <div className="screen-bg flex flex-col items-center justify-center">
        {/* <img src="/images/pong.jpeg" className="h-full" /> */}
      </div>
      <div className="flex w-full h-96 bg-red-400"></div>
      <div className="flex w-full h-96 bg-blue-400"></div>
      <div className="flex w-full h-96 bg-pink-400"></div>
    </div>
  );
};

export default HomePage;
