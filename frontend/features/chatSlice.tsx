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
export interface ChannelMember {
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
  newChannelId?: number;
  channels: Channel[];
  unjoinedChannels: Channel[];
  channel: Channel;
  channelContent: ChannelMessage[];
  channelMembers: ChannelMember[];
  directMessage: DirectMessage[];
  memberStatus: string;
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
  memberStatus: "",
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
        `http://localhost:3001/api/channels/create`,
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
        `http://localhost:3001/api/channels/joined`,
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
        `http://localhost:3001/api/channels/unjoined`,
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
        `http://localhost:3001/api/channels/${channelId}`,
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
        `http://localhost:3001/api/channels/${channelId}/members`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("channel %d members: ", channelId, response.data);

      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const muteChannelMember = createAsyncThunk(
  "channels/muteChannelMember",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/channels/${channelId}/mute-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("mute %d: ", memberId, response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const banChannelMember = createAsyncThunk(
  "channels/banChannelMember",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/channels/${channelId}/ban-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("ban %d: ", memberId, response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const kickChannelMember = createAsyncThunk(
  "channels/kickChannelMember",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/channels/${channelId}/kick-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("kick %d: ", memberId, response.data);
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
        `http://localhost:3001/api/messages/channels/${channelId}`,
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
        `http://localhost:3001/api/messages/direct/${userId}`,
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
    getNewChannelId: (
      state: InitialState = initialState,
      action: { payload: number | undefined; type: string }
    ) => {
      if (action.payload) {
        state.newChannelId = action.payload;
      } else {
        state.newChannelId = undefined;
      }
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
    builder.addCase(muteChannelMember.fulfilled, (state, action: any) => {
      state.memberStatus = "muted";
    });
    builder.addCase(banChannelMember.fulfilled, (state, action: any) => {
      state.memberStatus = "banned";
    });
    builder.addCase(kickChannelMember.fulfilled, (state, action: any) => {
      state.memberStatus = "kicked";
    });
  },
});

export const {
  setNewChannelModal,
  setChannelsListModal,
  addNewMessage,
  addNewChannel,
  getNewChannelId,
} = channelsManagmentSlice.actions;

export default channelsManagmentSlice.reducer;

//TODO update channel (name, password, owners)
//TODO add an openedLock icon for private joined channels
//TODO online/offline status (profile, friends list)
//TODO set sockets for update_member_status
//TODO set sockets for leave_channel
