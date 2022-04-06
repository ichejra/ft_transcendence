import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { User } from "./userProfileSlice";

export interface Channel {
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
  updateChannelModal: boolean;
  channelState: boolean;
  newChannel: { id: number; render: boolean };
  channels: Channel[];
  unjoinedChannels: Channel[];
  channel: Channel;
  channelContent: ChannelMessage[];
  channelMembers: ChannelMember[];
  memberStatus: string;
  muteMember: boolean;
  isMute: boolean;
  isBan: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isMember: boolean;
}

const initialState: InitialState = {
  createNewChannel: false,
  showChannelsList: false,
  updateChannelModal: false,
  channelState: false,
  newChannel: { id: -1, render: false },
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
  memberStatus: "",
  muteMember: false,
  isMute: false,
  isBan: false,
  isAdmin: true,
  isOwner: true,
  isMember: false,
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
//! *****************************************
//! *****************************************
export const setMemberAsAdmin = createAsyncThunk(
  "channels/setMemberAsAdmin",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/channels/${channelId}/add-new-admin`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("set admin %d: ", memberId, response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

//! *****************************************

export const setAdminAsMember = createAsyncThunk(
  "channels/setAdminAsMember",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/channels/${channelId}/remove-admin`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("remove admin  %d: ", memberId, response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);
//! *****************************************
//! *****************************************

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

export const unmuteChannelMember = createAsyncThunk(
  "channels/unmuteChannelMember",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/channels/${channelId}/unmute-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("unmute %d: ", memberId, response.data);
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

export const unbanChannelMember = createAsyncThunk(
  "channels/unbanChannelMember",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/channels/${channelId}/unban-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("unban %d: ", memberId, response.data);
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

    setUpdateChannelModal: (
      state: InitialState = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.updateChannelModal = action.payload;
    },
    addNewMessage: (
      state: InitialState = initialState,
      action: PayloadAction<ChannelMessage>
    ) => {
      state.channelContent.push(action.payload);
      // console.log("CHAT SLICE", current(state.channelContent));
    },

    updateChannelState: (state: InitialState = initialState) => {
      state.channelState = !state.channelState;
      // console.log("CHAT SLICE", current(state.channelContent));
    },
    setNewChannelId: (
      state: InitialState = initialState,
      action: { payload: { id: number; render: boolean }; type: string }
    ) => {
      state.newChannel = action.payload;
      // console.log("CHAT SLICE", current(state.channelContent));
    },

    setIsMute: (
      state: InitialState = initialState,
      action: { payload: boolean; type: string }
    ) => {
      state.isMute = action.payload;
    },
    setIsBan: (
      state: InitialState = initialState,
      action: { payload: boolean; type: string }
    ) => {
      state.isBan = action.payload;
    },

    setIsAdmin: (state: InitialState = initialState) => {
      state.isAdmin = true;
      state.isOwner = false;
      state.isMember = false;
    },
    setIsOwner: (state: InitialState = initialState) => {
      state.isOwner = true;
      state.isAdmin = false;
      state.isMember = false;
    },

    setIsMember: (state: InitialState = initialState) => {
      state.isMember = true;
      state.isAdmin = false;
      state.isOwner = false;
    },

    setMuteCountDown: (state: InitialState = initialState) => {
      state.muteMember = true;
    },
    endMuteCountDown: (
      state: InitialState = initialState,
      action: { payload: string | undefined }
    ) => {
      state.muteMember = false;
      if (action.payload) {
        state.memberStatus = action.payload;
      }
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

    builder.addCase(getChannelMembersList.fulfilled, (state, action: any) => {
      state.channelMembers = action.payload;
    });
    //! ************************
    builder.addCase(setMemberAsAdmin.fulfilled, (state, action: any) => {
      state.memberStatus = "admin";
    });
    builder.addCase(setAdminAsMember.fulfilled, (state, action: any) => {
      state.memberStatus = "member";
    });
    //! ************************

    builder.addCase(muteChannelMember.fulfilled, (state, action: any) => {
      state.memberStatus = "muted";
    });
    builder.addCase(unmuteChannelMember.fulfilled, (state, action: any) => {
      state.memberStatus = "unmuted";
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
  setUpdateChannelModal,
  addNewMessage,
  updateChannelState,
  setNewChannelId,
  setMuteCountDown,
  endMuteCountDown,
  setIsMute,
  setIsBan,
  setIsAdmin,
  setIsOwner,
  setIsMember,
} = channelsManagmentSlice.actions;

export default channelsManagmentSlice.reducer;

//TODO update channel (name, password, owners)
//TODO add an openedLock icon for private joined channels
//TODO online/offline status (profile, friends list)
//TODO set sockets for update_member_status
