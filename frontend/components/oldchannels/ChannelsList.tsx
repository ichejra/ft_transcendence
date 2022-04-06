import { HiViewGridAdd } from "react-icons/hi";
import { SiPrivateinternetaccess } from "react-icons/si";
import { MdExplore } from "react-icons/md";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setNewChannelModal,
  setChannelsListModal,
} from "../../features/chatSlice";

interface Props {
  setShowDirect: (s: boolean) => void;
  getSelectedChannel: (id: number) => void;
  setShowChannelContent: (s: boolean) => void;
}

const ChannelsList: React.FC<Props> = ({
  setShowDirect,
  getSelectedChannel,
  setShowChannelContent,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { channels } = useAppSelector((state) => state.channels);

  const getChannelMessages = (id: number) => {
    setShowDirect(false);
    dispatch(setChannelsListModal(false));
    getSelectedChannel(id);
  };

  const getDirectMessages = () => {
    setShowDirect(true);
    setShowChannelContent(false);
    navigate(`/channels/direct`);
  };

  const createChannel = () => {
    dispatch(setNewChannelModal(true));
  };

  const exploreChannels = () => {
    dispatch(setChannelsListModal(true));
  };

  return (
    <div>
      <div
        onClick={getDirectMessages}
        className={`hover:scale-105 ${
          pathname === "/channels/direct" && "highlight"
        } cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3`}
      >
        Inbox
      </div>
      <hr className="mx-10" />
      {channels.map((channel) => {
        const { id, name, type } = channel;
        return (
          <div
            key={id}
            onClick={() => getChannelMessages(id)}
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
        onClick={exploreChannels}
        className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
      >
        <MdExplore size="3rem" />
      </div>
    </div>
  );
};

export default ChannelsList;
