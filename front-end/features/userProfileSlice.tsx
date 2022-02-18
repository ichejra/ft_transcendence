import { createSlice } from "@reduxjs/toolkit";

interface Err {
  isError: boolean;
  message: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  picture: string;
  friends: string[];
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
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    picture: "",
    friends: [],
  },
};

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
});
