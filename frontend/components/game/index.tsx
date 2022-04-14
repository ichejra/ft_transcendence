
import Pong from "./Pong";

interface UserType {
  userType: string;
}

const PongGame: React.FC<UserType> = ({ userType }) => {
  return (
    <div className="page-100 w-full h-full relative">
      <Pong userType={userType} />
    </div>
  );
};

export default PongGame;
