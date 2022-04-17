interface Props {
  name: string;
  color: string;
  coords: {
    leftTop: string;
    rightTop: string;
  };
}

const Member: React.FC<Props> = ({ name, color, coords }) => {
  return (
    <div className={`w-[204px] h-[261px] ${color} relative`}>
      <div
        className={`absolute w-16 h-14 bg-white left-0 ${coords.leftTop}`}
      ></div>
      <div
        className={`absolute w-16 h-14 bg-white right-0 ${coords.rightTop}`}
      ></div>
      <div className="absolute w-[194px] h-[251px] bg-yellow-300 left-[5px] top-[5px] flex">
        <h1 className="m-auto text-[3rem] about-title-family">{name}</h1>
      </div>
    </div>
  );
};

export default Member;
