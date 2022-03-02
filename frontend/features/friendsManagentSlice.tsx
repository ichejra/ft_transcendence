import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";

const initialState: {
  sentReq: boolean;
  acceptReq: boolean;
  pendingReq: boolean;
} = {
  sentReq: false,
  acceptReq: false,
  pendingReq: false,
};

// fetch the friends managment endpoints

export const friendsManagementSlice = createSlice({
  name: "friendsManagment",
  initialState,
  reducers: {
    sentFriendReq: (state) => {
      state.sentReq = true;
      state.pendingReq = true;
      state.acceptReq = false;
    },
    acceptFriendReq: (state) => {
      state.sentReq = false;
      state.pendingReq = false;
      state.acceptReq = true;
    },
  },
});

export const { sentFriendReq, acceptFriendReq } =
  friendsManagementSlice.actions;

export default friendsManagementSlice.reducer;
