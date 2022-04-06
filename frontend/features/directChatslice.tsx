import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
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
  directChatUsersHistory: User[];
  directMessages: DirectMessage[];
  chatFriend: User;
}

const initialState: InitialState = {
  showChatUsersModal: false,
  directChatUsersHistory: [],
  directMessages: [],
  chatFriend: {} as User,
};

export const fetchChatFriend = createAsyncThunk(
  "users/fetchChatFriend",
  async (userId: number, _api) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/${userId}`,
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
        `http://localhost:3001/api/messages/direct-chat`,
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
    addNewDirectMessage: (
      state: InitialState = initialState,
      action: PayloadAction<DirectMessage>
    ) => {
      state.directMessages.push(action.payload);
      // console.log("CHAT SLICE", current(state.channelContent));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDirectChatHistory.fulfilled, (state, action: any) => {
      state.directChatUsersHistory = action.payload;
    });
    builder.addCase(getDirectContent.fulfilled, (state, action: any) => {
      state.directMessages = action.payload;
    });
    builder.addCase(fetchChatFriend.fulfilled, (state, action: any) => {
      state.chatFriend = action.payload;
    });
  },
});

export const { addNewDirectMessage, setShowChatUsersModal } =
  directChatSlice.actions;

export default directChatSlice.reducer;
