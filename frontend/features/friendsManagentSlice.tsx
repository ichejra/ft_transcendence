import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { exit } from "process";

const initialState: {
  isFriend: boolean;
  sentReq: boolean;
  acceptReq: boolean;
  pendingReq: boolean;
} = {
  isFriend: false,
  sentReq: false,
  acceptReq: false,
  pendingReq: false,
};

// fetch the friends managment endpoints
// friends array fetch

export const fetchRequestStatus = createAsyncThunk(
  "user/fetchRequestStatus",
  async (id: string, _api) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/friend-request`,
        {
          recipientId: id,
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );
      console.log("Friend Request >> ", response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error);
    }
  }
);

export const fetchPendingStatus = createAsyncThunk(
  "user/fetchPendingStatus",
  async (id: string, _api) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/friend-request`,
        {
          recipientId: id,
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );
      console.log("Friend Request >> ", response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error);
    }
  }
);

export const friendsManagementSlice = createSlice({
  name: "friendsManagment",
  initialState,
  reducers: {
    sendFriendReq: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.sentReq = true;
      state.pendingReq = true;
      state.acceptReq = false;
    },
    acceptFriendReq: (state) => {
      state.sentReq = false;
      state.pendingReq = false;
      state.acceptReq = true;
    },
    cancelFriendReq: (state) => {
      state.sentReq = false;
      state.pendingReq = false;
      state.acceptReq = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRequestStatus.fulfilled, (state, action: any) => {
      console.log("payload: ", action.payload);
      state.pendingReq = true;
    });
  },
});

export const { sendFriendReq, cancelFriendReq, acceptFriendReq } =
  friendsManagementSlice.actions;

export default friendsManagementSlice.reducer;
