import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { User } from "./userProfileSlice";

// interface Message {
//   id: number;
//   author: User;
//   channel: Channel;
//   content: string;
//   createdAt: "";
// }

interface Channel {
  id: number;
  name: string;
  type: string;
  password: string;
}

interface InitialState {
  createNewChannel: boolean;
  channels: Channel[];
  channel: Channel;
}

const initialState: InitialState = {
  createNewChannel: false,
  channels: [],
  channel: {
    id: NaN,
    name: "",
    password: "",
    type: "",
  },
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
        `http://localhost:3000/channels/create`,
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
  "channels/fetchChannelContent",
  async (_, _api) => {
    try {
      const response = await axios.get(`http://localhost:3000/channels`, {
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
        `http://localhost:3000/channels/${channelId}`,
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
  },
});

export const { setNewChannelModal } = channelsManagmentSlice.actions;

export default channelsManagmentSlice.reducer;

//TODO get single channel
//TODO protect private channels
//TODO add lock icon to private channels
//TODO update channel (name, password, owners)
//TODO get channel messages
//TODO add message to channel
