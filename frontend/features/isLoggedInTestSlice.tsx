import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  isLoggedIn: boolean;

  profileAvatar: string;
  username: string;
  editProfile: boolean;
}
interface LoginAction {
  isLoggedIn: boolean;
}
interface ProfileInfo {
  profileAvatar: string;
  username: string;
}

const initialState: State = {
  isLoggedIn: false,

  profileAvatar: "/images/profile.jpeg",
  username: "",
  editProfile: false,
};

export const loggedInSlice = createSlice({
  name: "loginStatus",
  initialState,
  reducers: {
    setLoggedIn: (state = initialState, action: PayloadAction<LoginAction>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    // completeProfileInfo: (
    //   state = initialState,
    //   action: PayloadAction<ProfileInfo>
    // ) => {
    //   state.profileAvatar = action.payload.profileAvatar;
    //   state.username = action.payload.username;
    // },
    // editUserProfile: (state = initialState, action: PayloadAction<boolean>) => {
    //   state.editProfile = action.payload;
    // },
  },
});

export const { setLoggedIn, /* completeProfileInfo, editUserProfile */ } =
  loggedInSlice.actions;

export default loggedInSlice.reducer;
