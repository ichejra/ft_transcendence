import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { User } from "./userProfileSlice";

interface Channel {
  id: number;
  name: string;
  type: string;
  password: string;
}

export interface ChannelMessage {
  author: User;
  channel: Channel;
  content: string;
  createdAt: string;
  id: number;
}

interface DBChannelMessage {
  id: number;
  authorId: number;
  channelId: number;
  content: string;
  createdAt: string;
}

interface DirectMessage {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  createdAt: string;
}

interface InitialState {
  createNewChannel: boolean;
  channels: Channel[];
  channel: Channel;
  channelContent: ChannelMessage[];
  dbChannelContent: DBChannelMessage[];
  directMessage: DirectMessage[];
}

const initialState: InitialState = {
  createNewChannel: false,
  channels: [],
  channel: {
    id: 0,
    name: "",
    password: "",
    type: "",
  },
  channelContent: [],
  dbChannelContent: [],
  directMessage: [],
};

export const createChannel = createAsyncThunk(
  "channels/createChannel",
  async (
    {
      name,
      password,
      type,
    }: {
      name: string;
      type: string;
      password: string;
    },
    _api
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/channels/create`,
        {
          name,
          type,
          password,
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const getChannelsList = createAsyncThunk(
  "channels/getChannelsList",
  async (_, _api) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/channels`, {
        headers: {
          authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const getSingleChannel = createAsyncThunk(
  "channels/getSingleChannel",
  async (channelId: number, _api) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/channels/${channelId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const getChannelContent = createAsyncThunk(
  "channels/getChannelContent",
  async (channelId: number, _api) => {
    console.log("get channel messages", channelId);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/messages/channels/${channelId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("messages:", response.data);

      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const getDirectContent = createAsyncThunk(
  "direct/getDirectContent",
  async (userId: number, _api) => {
    console.log("get direct messages", userId);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/messages/direct/${userId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("messages:", response.data);

      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

const channelsManagmentSlice = createSlice({
  name: "channelsManagment",
  initialState,
  reducers: {
    setNewChannelModal: (
      state: InitialState = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.createNewChannel = action.payload;
    },
    addNewMessage: (
      state: InitialState = initialState,
      action: PayloadAction<ChannelMessage>
    ) => {
      const message: ChannelMessage = { ...action.payload };
      state.channelContent.push(message);
      console.log("CC ===> ", state.channelContent);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChannel.fulfilled, (state, action: any) => {
      state.channel = action.payload;
    });
    builder.addCase(getChannelsList.fulfilled, (state, action: any) => {
      state.channels = action.payload;
    });
    builder.addCase(getSingleChannel.fulfilled, (state, action: any) => {
      state.channel = action.payload;
    });
    builder.addCase(getChannelContent.fulfilled, (state, action: any) => {
      state.dbChannelContent = action.payload;
    });
    builder.addCase(getDirectContent.fulfilled, (state, action: any) => {
      state.directMessage = action.payload;
    });
  },
});

export const { setNewChannelModal, addNewMessage } =
  channelsManagmentSlice.actions;

export default channelsManagmentSlice.reducer;

//TODO get channel messages
//TODO add message to channel
//TODO protect private channels
//TODO add lock icon to private channels
//TODO update channel (name, password, owners)
