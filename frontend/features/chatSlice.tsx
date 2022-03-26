import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
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
  channel?: Channel;
  content: string;
  createdAt: string;
  id: number;
}

interface DirectMessage {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  createdAt: string;
}
export interface Member {
  id: number;
  userRole: string;
  userStatus: string;
  createdAt: string;
  user: User;
}

interface InitialState {
  createNewChannel: boolean;
  showChannelsList: boolean;
  addChannel: boolean;
  channels: Channel[];
  unjoinedChannels: Channel[];
  channel: Channel;
  channelContent: ChannelMessage[];
  channelMembers: Member[];
  directMessage: DirectMessage[];
}

const initialState: InitialState = {
  createNewChannel: false,
  showChannelsList: false,
  addChannel: false,
  channels: [],
  unjoinedChannels: [],
  channel: {
    id: 0,
    name: "",
    password: "",
    type: "",
  },
  channelContent: [],
  channelMembers: [],
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
      const response = await axios.get(
        `http://localhost:3000/api/channels/joined`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("joined channels", response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const fetchUnjoinedChannels = createAsyncThunk(
  "channels/fetchUnjoinedChannels",
  async (_, _api) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/channels/unjoined`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("unjoined channels", response.data);
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

export const getChannelMembersList = createAsyncThunk(
  "channels/getChannelMembersList",
  async (channelId: number, _api) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/channels/${channelId}/members`,
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
    try {
      const response = await axios.get(
        `http://localhost:3000/api/messages/channels/${channelId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("CHAT SLICE:", response.data);
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
    setChannelsListModal: (
      state: InitialState = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.showChannelsList = action.payload;
    },
    addNewMessage: (
      state: InitialState = initialState,
      action: PayloadAction<ChannelMessage>
    ) => {
      state.channelContent.push(action.payload);
      // console.log("CHAT SLICE", current(state.channelContent));
    },
    addNewChannel: (state: InitialState = initialState) => {
      state.addChannel = !state.addChannel;
      // console.log("CHAT SLICE", current(state.channelContent));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChannel.fulfilled, (state, action: any) => {
      state.channel = action.payload;
    });
    builder.addCase(getChannelsList.fulfilled, (state, action: any) => {
      state.channels = action.payload;
    });
    builder.addCase(fetchUnjoinedChannels.fulfilled, (state, action: any) => {
      state.unjoinedChannels = action.payload;
    });
    builder.addCase(getSingleChannel.fulfilled, (state, action: any) => {
      state.channel = action.payload;
    });
    builder.addCase(getChannelContent.fulfilled, (state, action: any) => {
      state.channelContent = action.payload;
    });
    builder.addCase(getDirectContent.fulfilled, (state, action: any) => {
      state.directMessage = action.payload;
    });
    builder.addCase(getChannelMembersList.fulfilled, (state, action: any) => {
      state.channelMembers = action.payload;
    });
  },
});

export const {
  setNewChannelModal,
  setChannelsListModal,
  addNewMessage,
  addNewChannel,
} = channelsManagmentSlice.actions;

export default channelsManagmentSlice.reducer;
//TODO add join/leave button
//TODO protect private channels
//TODO update channel (name, password, owners)
