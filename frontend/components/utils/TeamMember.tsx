interface Props {
  img: string;
  color: string;
  coords: {
    leftTop: string;
    rightTop: string;
  };
}

const Member: React.FC<Props> = ({ img, color, coords }) => {
  return (
    <div className={`w-[204px] h-[261px] ${color} relative`}>
      <div
        className={`absolute w-16 h-14 bg-white left-0 ${coords.leftTop}`}
      ></div>
      <div
        className={`absolute w-16 h-14 bg-white right-0 ${coords.rightTop}`}
      ></div>
      <div className="absolute w-[194px] h-[251px] bg-red-200 left-[5px] top-[5px]">
        <img src={img} className="w-full h-full" />
      </div>
    </div>
  );
};

export default Member;
