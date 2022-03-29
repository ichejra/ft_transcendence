import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  refresh: boolean;
  updateMessages: boolean;
  membersList: boolean;
} = {
  refresh: false,
  updateMessages: false,
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
    updateMemmbersList: (state = initialState) => {
      state.membersList = !state.membersList;
    },
  },
});

export const { updateGlobalState, updateChannelContent, updateMemmbersList } =
  updateGlobalSlice.actions;

export default updateGlobalSlice.reducer;
