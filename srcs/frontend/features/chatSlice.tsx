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

export interface ChannelOwner {
  id: number;
  channel: Channel;
  userRole: string;
  userStatus: string;
  createdAt: string;
  user: User;
}

interface InitialState {
  createNewChannel: boolean;
  showChannelsList: boolean;
  updateChannelModal: boolean;
  showMembersList: boolean;
  channelState: boolean;
  newChannel: { id: number; render: boolean };
  channels: Channel[];
  unjoinedChannels: Channel[];
  channel: Channel;
  channelContent: ChannelMessage[];
  channelMembers: ChannelMember[];
  channelAdmins: ChannelMember[];
  loggedMemberRole: ChannelOwner;
  memberStatus: string;
  currentChannelId: number;
  error: { status: number; message: string };
}

const initialState: InitialState = {
  createNewChannel: false,
  showChannelsList: false,
  updateChannelModal: false,
  showMembersList: false,
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
  channelAdmins: [],
  loggedMemberRole: {} as ChannelOwner,
  memberStatus: "",
  currentChannelId: -1,
  error: { status: 200, message: "OK" },
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
        `http://192.168.99.116:3001/api/channels/create`,
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
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const updateChannel = createAsyncThunk(
  "channels/updateChannel",
  async (
    {
      name,
      password,
      type,
      channelId,
    }: {
      name: string;
      type: string;
      password: string;
      channelId: number;
    },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://192.168.99.116:3001/api/channels/${channelId}`,
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
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const getChannelsList = createAsyncThunk(
  "channels/getChannelsList",
  async (_, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/channels/joined`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const fetchUnjoinedChannels = createAsyncThunk(
  "channels/fetchUnjoinedChannels",
  async (_, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/channels/unjoined`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const getSingleChannel = createAsyncThunk(
  "channels/getSingleChannel",
  async (channelId: number, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/channels/${channelId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const getLoggedUserRole = createAsyncThunk(
  "channels/getLoggedUserRole",
  async (channelId: number, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/channels/${channelId}/role`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const getChannelMembersList = createAsyncThunk(
  "channels/getChannelMembersList",
  async (channelId: number, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/channels/${channelId}/members`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const getChannelAdminsList = createAsyncThunk(
  "channels/getChannelAdminsList",
  async (channelId: number, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/channels/${channelId}/admins`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const setMemberAsAdmin = createAsyncThunk(
  "channels/setMemberAsAdmin",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://192.168.99.116:3001/api/channels/${channelId}/add-new-admin`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const setAdminAsMember = createAsyncThunk(
  "channels/setAdminAsMember",
  async (
    { channelId, memberId }: { channelId: number; memberId: number },
    _api
  ) => {
    try {
      const response = await axios.patch(
        `http://192.168.99.116:3001/api/channels/${channelId}/remove-admin`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
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
        `http://192.168.99.116:3001/api/channels/${channelId}/mute-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
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
        `http://192.168.99.116:3001/api/channels/${channelId}/unmute-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
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
        `http://192.168.99.116:3001/api/channels/${channelId}/ban-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
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
        `http://192.168.99.116:3001/api/channels/${channelId}/unban-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
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
        `http://192.168.99.116:3001/api/channels/${channelId}/kick-user`,
        { memberId },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const getChannelContent = createAsyncThunk(
  "channels/getChannelContent",
  async (channelId: number, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/messages/channels/${channelId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
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
    setShowMembersList: (
      state: InitialState = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.showMembersList = action.payload;
    },

    addNewMessage: (
      state: InitialState = initialState,
      action: PayloadAction<ChannelMessage>
    ) => {
      state.channelContent.push(action.payload);
    },

    updateChannelState: (state: InitialState = initialState) => {
      state.channelState = !state.channelState;
    },
    setNewChannelId: (
      state: InitialState = initialState,
      action: { payload: { id: number; render: boolean }; type: string }
    ) => {
      state.newChannel = action.payload;
    },

    getSelectedChannelId: (
      state: InitialState = initialState,
      action: PayloadAction<number>
    ) => {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChannel.fulfilled, (state, action: any) => {
      state.channel = action.payload;
    });
    builder.addCase(createChannel.rejected, (state, action: any) => {
      state.error = { status: 403, message: "This name is not available." };
    });

    builder.addCase(updateChannel.fulfilled, (state, action: any) => {
      state.channel = action.payload;
    });
    builder.addCase(updateChannel.rejected, (state, action: any) => {
      state.error = { status: 403, message: "This name is not available." };
    });

    builder.addCase(getChannelsList.fulfilled, (state, action: any) => {
      state.channels = action.payload;
    });
    builder.addCase(fetchUnjoinedChannels.fulfilled, (state, action: any) => {
      state.unjoinedChannels = action.payload;
    });

    builder.addCase(getSingleChannel.fulfilled, (state, action: any) => {
      state.channel = action.payload;
      state.error = { status: 200, message: "ok" };
    });
    builder.addCase(getSingleChannel.rejected, (state, action: any) => {
      state.error = { status: 404, message: "this resource is not available" };
    });

    builder.addCase(getLoggedUserRole.fulfilled, (state, action: any) => {
      state.loggedMemberRole = action.payload;
    });
    builder.addCase(getChannelContent.fulfilled, (state, action: any) => {
      state.channelContent = action.payload;
    });
    builder.addCase(getChannelMembersList.fulfilled, (state, action: any) => {
      state.channelMembers = action.payload;
    });
    builder.addCase(getChannelAdminsList.fulfilled, (state, action: any) => {
      state.channelAdmins = action.payload;
    });
    builder.addCase(setMemberAsAdmin.fulfilled, (state) => {
      state.memberStatus = "admin";
    });
    builder.addCase(setAdminAsMember.fulfilled, (state) => {
      state.memberStatus = "member";
    });
    builder.addCase(muteChannelMember.fulfilled, (state) => {
      state.memberStatus = "muted";
    });
    builder.addCase(unmuteChannelMember.fulfilled, (state) => {
      state.memberStatus = "unmuted";
    });
    builder.addCase(banChannelMember.fulfilled, (state) => {
      state.memberStatus = "banned";
    });
    builder.addCase(kickChannelMember.fulfilled, (state) => {
      state.memberStatus = "kicked";
    });
  },
});

export const {
  setNewChannelModal,
  setChannelsListModal,
  setUpdateChannelModal,
  setShowMembersList,
  addNewMessage,
  updateChannelState,
  setNewChannelId,
  getSelectedChannelId,
} = channelsManagmentSlice.actions;

export default channelsManagmentSlice.reducer;
