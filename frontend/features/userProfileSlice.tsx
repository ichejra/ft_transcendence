import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Err {
  isError: boolean;
  message: string;
}

interface User {
  id?: string;
  display_name?: string;
  username?: string;
  email?: string;
  picture?: string;
  friends?: string[];
}

interface UserState {
  isLoading: boolean;
  isError: Err;
  user: User;
}

const initialState: UserState = {
  isLoading: true,
  isError: { isError: false, message: "" },
  user: {
    id: "",
    display_name: "",
    username: "",
    email: "",
    picture: "",
    friends: [],
  },
};

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    getUsers: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { getUsers } = userProfileSlice.actions;

export default userProfileSlice.reducer;
