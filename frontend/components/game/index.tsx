
import { useEffect, useState } from "react";
import Pong from "./Pong";

interface UserType {
  userType: string;
}

const PongGame: React.FC<UserType> = ({ userType }) => {
  const [tableColor, setTableColor] = useState("#000000");
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    // if (count === 0) setTableColor('#0818A8');
    // if (count === 0) setTableColor('#000080');
    // if (count === 0) setTableColor('#191970');
    // if (count === 0) setTableColor('#00008B'); //blue
    if (count === 0) setTableColor("#00A36C");
    // green
    else if (count === 1) setTableColor("#fbb3c2");
    // pink
    else if (count === 2) setTableColor("#FF59A1");
    //pink
    else if (count === 3) setTableColor("#CD5C5C");
    // pink
    else if (count == 4) {
      setCount(0);
      setTableColor("#000000");
    }
  };

  return (
    // <div className=''>
    <div className="page-100 w-full h-full relative">
      <Pong userType={userType} />
    </div>
    // </div>
  );
};

export default PongGame;
