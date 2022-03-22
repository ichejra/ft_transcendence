import { createSlice } from "@reduxjs/toolkit";

const initialState: { refresh: boolean; updateMessages: boolean } = {
  refresh: false,
  updateMessages: false,
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
  },
});

export const { updateGlobalState, updateChannelContent } =
  updateGlobalSlice.actions;

export default updateGlobalSlice.reducer;
