import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import UserProfile from "../components/profile/Profile";
import axios from "axios";

interface Err {
  isError: boolean;
  message: string;
}

interface User {
  id: number;
  display_name?: string;
  user_name?: string;
  email?: string;
  avatar_url: string;
  is_active: boolean;
  state: boolean;
  friends?: string[];
}
interface UserState {
  isLoading: boolean;
  isError: Err;
  user: User;
  isLoggedIn: boolean;
  editProfile: boolean;
}

const initialState: UserState = {
  isLoading: true,
  isError: { isError: false, message: "" },
  isLoggedIn: false,
  user: {
    id: NaN,
    display_name: "",
    user_name: "",
    email: "",
    avatar_url: "",
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
      const response = await axios.get("http://localhost:3000/users/me", {
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      });
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const completeProfileInfo = createAsyncThunk(
  "user/completeProfileInfo",
  async ({ data }: { data: FormData }, _api) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/update-profile`,
        data,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      _api.rejectWithValue(error.message);
    }
  }
);

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    logOutUser: (state = initialState) => {
      Cookies.remove("jwt");
      Cookies.remove("user");
      state.isLoggedIn = false;
    },
    editUserProfile: (state = initialState, action: PayloadAction<boolean>) => {
      state.editProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: any) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
    });
    builder.addCase(completeProfileInfo.fulfilled, (state, action: any) => {
      state.user = action.payload;
    });
    builder.addCase(completeProfileInfo.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
    });
  },
});

export const { editUserProfile, logOutUser } = userProfileSlice.actions;

export default userProfileSlice.reducer;
