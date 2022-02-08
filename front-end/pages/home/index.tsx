import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <div className="page-100 flex justify-center text-yellow-400">
      <div className="screen-bg flex w-full bg-black justify-center items-center">
        <h1 className="text-2xl">LANDING</h1>
      </div>
      {/* 
      <div className="flex w-full h-96 bg-red-400"></div>
      <div className="flex w-full h-96 bg-blue-400"></div>
      <div className="flex w-full h-96 bg-pink-400"></div> */}
    </div>
  );
};

export default HomePage;
