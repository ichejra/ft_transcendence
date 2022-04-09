import { HiViewGridAdd } from "react-icons/hi";
import { SiPrivateinternetaccess } from "react-icons/si";
import { MdExplore } from "react-icons/md";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setNewChannelModal,
  setChannelsListModal,
} from "../../features/chatSlice";

interface Props {
  setShowChannelContent: (s: boolean) => void;
  getCurrentChannelContent: (id: number) => void;
}

const ChannelsList: React.FC<Props> = ({ getCurrentChannelContent }) => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { channels } = useAppSelector((state) => state.channels);

  //* Functions_________
  //? Create new channel
  const createChannel = () => {
    dispatch(setNewChannelModal(true));
  };

  //? Discover unjoined channels
  const exploreUnjoinedChannels = () => {
    dispatch(setChannelsListModal(true));
  };

  return (
    <div>
      <hr className="mx-10" />
      {channels.map((channel) => {
        const { id, name, type } = channel;
        return (
          <div
            key={id}
            onClick={() => getCurrentChannelContent(id)}
            className={`hover:scale-105 ${
              id === Number(params.id) && "highlight"
            } relative cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-xl w-[70px] h-[70px] flex items-center justify-center mx-6 my-3`}
          >
            {type === "private" && (
              <div className="absolute -top-[8px] -right-[8px]">
                <SiPrivateinternetaccess
                  size="1.3rem"
                  className="text-blue-400"
                />
              </div>
            )}
            {name.split(" ").length >= 2
              ? name.split(" ")[0][0].toUpperCase() +
                name.split(" ")[1][0].toUpperCase()
              : name.substring(0, 2).toUpperCase()}
          </div>
        );
      })}
      <div
        onClick={createChannel}
        className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
      >
        <HiViewGridAdd size="3rem" />
      </div>
      <div
        onClick={exploreUnjoinedChannels}
        className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
      >
        <MdExplore size="3rem" />
      </div>
    </div>
  );
};

export default ChannelsList;
