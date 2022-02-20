import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import UserProfile from "../components/profile/Profile";

interface Err {
  isError: boolean;
  message: string;
}

interface User {
  id: number;
  display_name?: string;
  user_name?: string;
  email?: string;
  avatar_url?: string;
  is_active: boolean;
  state: boolean;
  friends?: string[];
}
interface UserState {
  isLoading: boolean;
  isError: Err;
  user: User;
  editProfile: boolean;
}

const initialState: UserState = {
  isLoading: true,
  isError: { isError: false, message: "" },
  user: {
    id: 0,
    display_name: "El Hassane Lahyani",
    user_name: "elahyani",
    email: "",
    avatar_url: "https://cdn.intra.42.fr/users/elahyani.jpg",
    is_active: false,
    state: false,
    friends: [],
  },
  editProfile: false,
};

export const fetchCurrentUser = createAsyncThunk(
  "users/fetchUserStatus",
  async (_, _api) => {
    try {
      const response = await fetch("http://localhost:3000/users/me", {
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
      const currentUser = await response.json();
      console.log(currentUser);
      return _api.fulfillWithValue(currentUser);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const completeProfileInfo = createAsyncThunk(
  "user/completeProfileInfo",
  async (
    {
      id,
      user_name,
      avatar_url,
    }: { id: number; user_name: string; avatar_url: string },
    _api
  ) => {
    console.log("-->", id, user_name, avatar_url);

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ user_name, avatar_url }),
      });
      const user = await response.json();
      return _api.fulfillWithValue(user);
    } catch (error: any) {
      _api.rejectWithValue(error.message);
    }
  }
);

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    editUserProfile: (state = initialState, action: PayloadAction<boolean>) => {
      state.editProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: any) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
      state.isLoading = false;
    });

    builder.addCase(completeProfileInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(completeProfileInfo.fulfilled, (state, action: any) => {
      state.user = action.payload;
    });
    builder.addCase(completeProfileInfo.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
    });
  },
});

export const { editUserProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
