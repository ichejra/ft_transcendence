import { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setUpdateChannelModal,
  Channel,
  getChannelsList,
  updateChannel,
  getSingleChannel,
  setNewChannelId,
} from "../../features/chatSlice";
import { RadioButton } from "./NewChannelModal";

interface Props {
  channelId: number;
  channelOldName: string;
}

const UpdateChannelModal: React.FC<Props> = ({ channelId, channelOldName }) => {
  const divRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [isPrivate, setIsPrivate] = useState(false);
  const [isValid, setIsValid] = useState(0);
  const [channelName, setChannelName] = useState(channelOldName);
  const [channelPass, setChannelPass] = useState("");
  const { error } = useAppSelector((state) => state.channels);

  const submitChannelUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid !== 1) return;
    dispatch(
      updateChannel({
        name: channelName,
        password: channelPass,
        type: isPrivate ? "private" : "public",
        channelId,
      })
    ).then((data: any) => {
      if (data.error) {
        setIsValid(3);
      } else {
        const updatedChannel: Channel = data.payload;
        dispatch(getChannelsList()).then(() => {
          dispatch(setNewChannelId({ id: updatedChannel.id, render: true }));
          dispatch(setUpdateChannelModal(false));
        });
      }
    });
  };

  const handleRadioChange = () => {
    setIsPrivate(!isPrivate);
  };

  useEffect(() => {
    dispatch(getSingleChannel(channelId)).then((data: any) => {
      setChannelName(data.payload.channel.name);
      if (data.payload.channel.type === "public") {
        setIsPrivate(false);
      } else {
        setIsPrivate(true);
      }
      inputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const channelNameRegex = /^[a-zA-Z0-9 ]{6,}$/i;
    const channelPassRegex = /^.{6,}$/i;
    setIsValid(() => {
      if (!channelName) {
        return 0;
      }
      return !channelNameRegex.test(channelName) ||
        (isPrivate && channelPass && !channelPassRegex.test(channelPass))
        ? 0
        : 1;
    });
  }, [channelName, channelPass, isPrivate]);

  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) {
          dispatch(setUpdateChannelModal(false));
        }
      }}
      className="fixed top-0 left-0 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="profile-card-bg-color w-full h-full md:w-[700px] md:h-[516px] border-[1px] border-gray-700">
          <div className="relative flex h-full">
            <div className="relative text-gray-300 h-full w-full flex flex-col items-center justify-center space-y-[2rem]">
              <h1 className=" text-xl about-title-family">Update Channel</h1>
              <form
                onSubmit={submitChannelUpdate}
                className="flex flex-col items-center justify-center"
              >
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="name"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="text-sm m-2 p-2 w-[300px] bg-transparent border border-gray-700"
                />
                <p className="font-sans w-full ml-3 text-xs text-red-500">
                  {isValid === 3 && error.status === 403 && error.message}
                </p>
                <div className="w-full px-2 flex justify-start items-center">
                  <RadioButton
                    label="Public"
                    value={!isPrivate}
                    onChange={handleRadioChange}
                  />
                  <RadioButton
                    label="Private"
                    value={isPrivate}
                    onChange={handleRadioChange}
                  />
                </div>
                {isPrivate && (
                  <input
                    type="password"
                    placeholder="password"
                    value={channelPass}
                    onChange={(e) => setChannelPass(e.target.value)}
                    className="text-sm m-2 p-2 w-[300px] bg-transparent border border-gray-700"
                  />
                )}
                <input
                  type="submit"
                  value="Update"
                  placeholder="Channel name"
                  className={`${
                    isValid === 1
                      ? "cursor-pointer hover:bg-white transition duration-300"
                      : "opacity-40 cursor-not-allowed"
                  } text-sm m-2 p-2 w-[300px] border border-gray-300 text-blue-900 bg-gray-300 `}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateChannelModal;
