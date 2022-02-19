import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  isLoggedIn: boolean;
  isAdmin: boolean;
  profileAvatar: string;
  username: string;
  editProfile: boolean;
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
  isLoggedIn: true,
  isAdmin: true,
  profileAvatar: "/images/profile.jpeg",
  username: "elahyani",
  editProfile: false,
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
    editUserProfile: (state = initialState, action: PayloadAction<boolean>) => {
      state.editProfile = action.payload;
    },
  },
});

export const { setLoggedIn, completeProfileInfo, editUserProfile } =
  loggedInSlice.actions;

export default loggedInSlice.reducer;
