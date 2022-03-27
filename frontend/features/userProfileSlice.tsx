import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";

interface Err {
  isError: boolean;
  message: string;
}

export interface User {
  id: number;
  display_name: string;
  user_name: string;
  email?: string;
  avatar_url: string;
  is_active: boolean;
  state: boolean;
  createdAt: string;
}
interface UserState {
  isLoading: boolean;
  isError: Err;
  user: User;
  users: User[];
  nrusers: User[];
  friends: User[];
  isLoggedIn: boolean;
  editProfile: boolean;
  completeInfo: boolean;
  showNotifList: boolean;
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
    createdAt: "",
  },
  friends: [],
  users: [],
  nrusers: [],
  editProfile: false,
  completeInfo: false,
  showNotifList: false,
};

export const fetchNoRelationUsers = createAsyncThunk(
  "users/fetchNoRelationUsers",
  async (_, _api) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/no_relation",
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("[US] NRU ==>", response.data);

      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, _api) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/all_users",
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("[US] ARU ==>", response.data);

      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "users/fetchUserStatus",
  async (_, _api) => {
    try {
      const response = await axios.get("http://localhost:3001/api/users/me", {
        headers: {
          authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const fetchUserFriends = createAsyncThunk(
  "users/fetchUserFriends",
  async (_, _api) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/friends",
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("[US] Friends => ", response.data);

      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

export const completeProfileInfo = createAsyncThunk(
  "user/completeProfileInfo",
  async ({ data }: { data: FormData }, _api) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/users/update-profile`,
        data,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
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
      Cookies.remove("accessToken");
      state.isLoggedIn = false;
    },
    editUserProfile: (state = initialState, action: PayloadAction<boolean>) => {
      state.editProfile = action.payload;
    },
    completeUserInfo: (
      state = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.completeInfo = action.payload;
    },
    showNotificationsList: (
      state = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.showNotifList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNoRelationUsers.fulfilled, (state, action: any) => {
      state.nrusers = action.payload;
    });
    builder.addCase(fetchNoRelationUsers.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
    });

    builder.addCase(fetchAllUsers.fulfilled, (state, action: any) => {
      state.users = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, action: any) => {
      state.user = action.payload;
      if (state.user.user_name) {
        state.completeInfo = true;
      }
      state.isLoggedIn = true;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
    });

    builder.addCase(completeProfileInfo.fulfilled, (state, action: any) => {
      state.user = action.payload;
      state.completeInfo = true;
    });
    builder.addCase(completeProfileInfo.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
    });

    builder.addCase(fetchUserFriends.fulfilled, (state, action: any) => {
      state.friends = action.payload;
    });
    builder.addCase(fetchUserFriends.rejected, (state, action: any) => {
      state.isError = { isError: true, message: action.payload };
    });
  },
});

export const {
  showNotificationsList,
  editUserProfile,
  completeUserInfo,
  logOutUser,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
