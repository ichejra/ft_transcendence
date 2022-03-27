import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router";
import { SiPrivateinternetaccess } from "react-icons/si";
import { useEffect, useRef, useState } from "react";
import {
  setChannelsListModal,
  fetchUnjoinedChannels,
} from "../../features/chatSlice";

interface Props {
  getChannelMessages: (id: number) => void;
}

const ChannelsListModal: React.FC<Props> = ({ getChannelMessages }) => {
  const divRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { unjoinedChannels } = useAppSelector((state) => state.channels);

  useEffect(() => {
    dispatch(fetchUnjoinedChannels()).then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div>
        <div
          onClick={(e) => {
            if (e.target == divRef.current) {
              dispatch(setChannelsListModal(false));
            }
          }}
          className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
        >
          <div
            ref={divRef}
            className="flex flex-col justify-center items-center h-full"
          >
            <div className="profile-card-bg-color w-full h-full md:w-[700px] md:h-[500px] border-[1px] border-gray-700">
              <div className="loading"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) {
          dispatch(setChannelsListModal(false));
        }
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="profile-card-bg-color w-full h-full md:w-[700px] md:h-[500px] border-[1px] border-gray-700">
          <div className="h-full">
            <div className="relative text-gray-300 w-full flex flex-wrap">
              {unjoinedChannels.map((channel) => {
                const { id, name, type } = channel;
                return (
                  <div
                    key={id}
                    onClick={() => getChannelMessages(id)}
                    className={`hover:scale-105 relative cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-xl w-[320px] h-[90px] flex items-center justify-center mx-3 my-3`}
                  >
                    {type === "private" && (
                      <div className="absolute -top-[8px] -right-[8px]">
                        <SiPrivateinternetaccess
                          size="1.3rem"
                          className="text-blue-400"
                        />
                      </div>
                    )}
                    {name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelsListModal;
