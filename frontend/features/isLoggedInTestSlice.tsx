import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  isLoggedIn: boolean;
  isAdmin: boolean;
  profileAvatar: string;
  username: string;
}

interface LoginAction {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

interface ProfileInfo {
  profileAvatar: string;
  username: string;
}

const initialState: State = {
  isLoggedIn: false,
  isAdmin: false,
  profileAvatar: "/images/profile.jpeg",
  username: "",
};

export const loggedInSlice = createSlice({
  name: "loginStatus",
  initialState,
  reducers: {
    setLoggedIn: (state = initialState, action: PayloadAction<LoginAction>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.isAdmin = action.payload.isAdmin;
    },
    completeProfileInfo: (
      state = initialState,
      action: PayloadAction<ProfileInfo>
    ) => {
      state.profileAvatar = action.payload.profileAvatar;
      state.username = action.payload.username;
    },
  },
});

export const { setLoggedIn, completeProfileInfo } = loggedInSlice.actions;

export default loggedInSlice.reducer;
