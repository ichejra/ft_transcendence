import { createSlice } from "@reduxjs/toolkit";

const initialState: { refresh: boolean } = {
  refresh: false,
};

const updateGlobalSlice = createSlice({
  name: "updateGlobal",
  initialState,
  reducers: {
    updateGlobalState: (state = initialState) => {
      state.refresh = !state.refresh;
    },
  },
});

export const { updateGlobalState } = updateGlobalSlice.actions;

export default updateGlobalSlice.reducer;
