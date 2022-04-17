import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { User } from "./userProfileSlice";

export interface DirectMessage {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  createdAt: string;
}

interface InitialState {
  showChatUsersModal: boolean;
  showChatUsersHistory: boolean;
  directChatUsersHistory: User[];
  directMessages: DirectMessage[];
  chatFriend: User;
  error: { status: number; message: string };
}

const initialState: InitialState = {
  showChatUsersModal: false,
  showChatUsersHistory: false,
  directChatUsersHistory: [],
  directMessages: [],
  chatFriend: {} as User,
  error: { status: 200, message: "OK" },
};

export const fetchChatFriend = createAsyncThunk(
  "users/fetchChatFriend",
  async (userId: number, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/users/${userId}`,
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

export const getDirectChatHistory = createAsyncThunk(
  "direct/getDirectChatHistory",
  async (_, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/messages/direct-chat`,
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

export const getDirectContent = createAsyncThunk(
  "direct/getDirectContent",
  async (userId: number, _api) => {
    try {
      const response = await axios.get(
        `http://192.168.99.116:3001/api/messages/direct/${userId}`,
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

const directChatSlice = createSlice({
  name: "directChat",
  initialState,
  reducers: {
    setShowChatUsersModal: (
      state: InitialState = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.showChatUsersModal = action.payload;
    },
    setShowChatUsersHistory: (
      state: InitialState = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.showChatUsersHistory = action.payload;
    },
    addNewDirectMessage: (
      state: InitialState = initialState,
      action: PayloadAction<DirectMessage>
    ) => {
      state.directMessages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDirectChatHistory.fulfilled, (state, action: any) => {
      state.directChatUsersHistory = action.payload;
    });
    builder.addCase(getDirectContent.fulfilled, (state, action: any) => {
      state.directMessages = action.payload;
      state.error = { status: 200, message: "OK" };
    });
    builder.addCase(fetchChatFriend.fulfilled, (state, action: any) => {
      state.chatFriend = action.payload;
    });
  },
});

export const {
  addNewDirectMessage,
  setShowChatUsersModal,
  setShowChatUsersHistory,
} = directChatSlice.actions;

export default directChatSlice.reducer;
