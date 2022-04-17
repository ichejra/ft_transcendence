import { Link } from "react-router-dom";
import Member from "../utils/TeamMember";
import { frameData } from "../../consts";
import { socket } from "../../pages/SocketProvider";

socket.emit("connection", () => {
  console.log("connected");
});

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full  flex justify-center">
      <div className="page-50 mt-20 flex bg-black w-full 2xl:w-[80rem] flex-col items-center">
        <div className="hero-bg relative w-full 2xl:w-[80rem] flex items-center justify-between">
          <div className="home-script">
            <h1 className="home-title">PING PONG</h1>
            <p className="home-quote">Meet Your Childhood!</p>
            <Link to="/game">
              <button className="hover:scale-110 transition duration-300 play-button">
                PLAY NOW
              </button>
            </Link>
          </div>
          <img
            src="./images/heroSection.jpg"
            alt="a boy playing pong game"
            className="hero-img"
          />
        </div>
        <div className="flex flex-col lg:flex-row  w-full 2xl:w-[80rem] p-2 m-2 mt-20">
          <div className="w-full lg:w-2/3">
            <h1 className="title-family text-white text-opacity-80 text-2xl pb-4">
              PONG
            </h1>
            <p className="text-family text-white text-opacity-80">
              Pong is one of the first computer games that ever created, this
              simple tennis like game features two paddles and a ball. The game
              was originally developed by Allan Alcorn and released in 1972 by
              Atari corporations. Soon, Pong became a huge success that is
              considered to be the game which started the video games industry.
              <br />
              <span className="font-mono text-xs">source: ponggame.org</span>
            </p>
          </div>
          <div className="w-auto lg:w-1/3 relative mb-72 lg:mb-60 text-family pong-game">
            <div className="left-paddle"></div>
            <div className="ball"></div>
            <div className="right-paddle"></div>
          </div>
        </div>
        <div className="flex flex-col w-full 2xl:w-[80rem] items-center about-section mb-32">
          <h1 className="about-title-family text-white text-opacity-80 text-2xl pb-8">
            About
          </h1>
          <p className="about-family text-center text-white text-opacity-80 w-3/4">
            This project is about creating a website for the mighty Pong
            contest! It will allow you to play PING PONG gane as well as
            chatting with your friends. It is made by a team of 3 students of
            1337 | 42 school.
          </p>
        </div>
        <div className="w-5/6 xl:w-3/6 mb-40">
          <h1 className="about-title-family text-center text-white text-opacity-80 text-2xl pb-8">
            Team
          </h1>
          <div className="flex md:flex-row flex-col md:space-y-0 space-y-4 justify-between items-center md:w-full">
            {frameData.map((member, index) => {
              return <Member key={index} {...member} />;
            })}
          </div>
        </div>
        <div className="mb-32 flex flex-col items-center">
          <h3 className="about-family text-white text-opacity-80 text-center">
            Ready To Bring Out The Child In You?
          </h3>
          <Link to="/game">
            <button className="hover:scale-110 transition duration-300 play-button-bottom">
              PLAY NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
