import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <div className="page-100 flex justify-center text-yellow-400">
      <div className="screen-bg flex w-full bg-black justify-center items-center">
        <h1 className="text-2xl">OK</h1>
      </div>
    </div>
  );
};

export default HomePage;
