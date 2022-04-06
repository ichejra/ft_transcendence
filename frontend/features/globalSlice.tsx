import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  refresh: boolean;
  updateMessages: boolean;
  updateDirectMessages: boolean;
  membersList: boolean;
} = {
  refresh: false,
  updateMessages: false,
  updateDirectMessages: false,
  membersList: false,
};

const updateGlobalSlice = createSlice({
  name: "updateGlobal",
  initialState,
  reducers: {
    updateGlobalState: (state = initialState) => {
      state.refresh = !state.refresh;
    },
    updateChannelContent: (state = initialState) => {
      state.updateMessages = !state.updateMessages;
    },
    setUpdateDirectMessages: (state = initialState) => {
      state.updateDirectMessages = !state.updateDirectMessages;
    },
    updateMemmbersList: (state = initialState) => {
      state.membersList = !state.membersList;
    },
  },
});

export const {
  updateGlobalState,
  updateChannelContent,
  setUpdateDirectMessages,
  updateMemmbersList,
} = updateGlobalSlice.actions;

export default updateGlobalSlice.reducer;
