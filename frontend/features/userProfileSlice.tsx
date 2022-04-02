import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";

interface Err {
  isError: boolean;
  status: number;
}

export interface User {
  id: number;
  display_name: string;
  user_name: string;
  email?: string;
  avatar_url: string;
  is_active: boolean;
  state: string;
  createdAt: string;
}

interface History {
  id: number;
  score: string;
  playedAt: string;
  winnerId: number;
  loserId: number;
}
interface UserState {
  isLoading: boolean;
  isPageLoading: boolean;
  isError: Err;
  loggedUser: User;
  user: User;
  users: User[];
  nrusers: User[];
  friends: User[];
  gameHistory: History[];
  isLoggedIn: boolean;
  editProfile: boolean;
  completeInfo: boolean;
  showNotifList: boolean;
  isPending: boolean;
  isFriend: boolean;
  isBlocked: boolean;
}

const user: User = {
  id: NaN,
  display_name: "",
  user_name: "",
  email: "",
  avatar_url: "",
  is_active: false,
  state: "",
  createdAt: "",
};

const initialState: UserState = {
  isLoading: false,
  isPageLoading: false,
  isError: { isError: false, status: 0 },
  isLoggedIn: false,
  loggedUser: user,
  user: user,
  friends: [],
  gameHistory: [],
  users: [],
  nrusers: [],
  editProfile: false,
  completeInfo: false,
  showNotifList: false,
  isPending: false,
  isFriend: false,
  isBlocked: false,
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

export const fetchSingleUser = createAsyncThunk(
  "users/fetchSingleUser",
  async (userId: number, _api) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/${userId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
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
    setIsPending: (state = initialState, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
    setIsFriend: (state = initialState, action: PayloadAction<boolean>) => {
      state.isFriend = action.payload;
    },
    setIsBlocked: (state = initialState, action: PayloadAction<boolean>) => {
      state.isBlocked = action.payload;
    },
    setIsLoading: (state = initialState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsPageLoading: (
      state = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.isPageLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // No relation users
    builder.addCase(fetchNoRelationUsers.fulfilled, (state, action: any) => {
      state.nrusers = action.payload;
      state.isError = {
        isError: false,
        status: 0,
      };
    });
    builder.addCase(fetchNoRelationUsers.rejected, (state, action: any) => {
      state.isError = {
        isError: true,
        status: Number(action.payload.match(/(\d+)/)[0]),
      };
    });

    // All users
    builder.addCase(fetchAllUsers.fulfilled, (state, action: any) => {
      state.users = action.payload;
      state.isError = {
        isError: false,
        status: 0,
      };
    });
    builder.addCase(fetchAllUsers.rejected, (state, action: any) => {
      state.isError = {
        isError: true,
        status: Number(action.payload.match(/(\d+)/)[0]),
      };
    });

    // Logged user
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: any) => {
      state.loggedUser = action.payload;
      if (state.loggedUser.user_name) {
        state.completeInfo = true;
      }
      state.isLoggedIn = true;
      state.isError = {
        isError: false,
        status: 0,
      };
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action: any) => {
      state.isError = {
        isError: true,
        status: Number(action.payload.match(/(\d+)/)[0]),
      };
    });

    // Single user
    builder.addCase(fetchSingleUser.fulfilled, (state, action: any) => {
      state.user = action.payload;
      state.isError = {
        isError: false,
        status: 0,
      };
    });
    builder.addCase(fetchSingleUser.rejected, (state, action: any) => {
      console.log(
        "888888888888888888888->",
        Number(action.payload.match(/(\d+)/)[0])
      );
      state.isError = {
        isError: true,
        status: Number(action.payload.match(/(\d+)/)[0]),
      };
    });

    // Set logged user username
    builder.addCase(completeProfileInfo.fulfilled, (state, action: any) => {
      state.loggedUser = action.payload;
      state.completeInfo = true;
      state.isError = {
        isError: false,
        status: 0,
      };
    });
    builder.addCase(completeProfileInfo.rejected, (state, action: any) => {
      state.isError = {
        isError: true,
        status: Number(action.payload.match(/(\d+)/)[0]),
      };
    });

    // User friends
    builder.addCase(fetchUserFriends.fulfilled, (state, action: any) => {
      state.friends = action.payload;
      state.isError = {
        isError: false,
        status: 0,
      };
    });
    builder.addCase(fetchUserFriends.rejected, (state, action: any) => {
      state.isError = {
        isError: true,
        status: Number(action.payload.match(/(\d+)/)[0]),
      };
    });
  },
});

export const {
  showNotificationsList,
  editUserProfile,
  completeUserInfo,
  logOutUser,
  setIsPending,
  setIsFriend,
  setIsBlocked,
  setIsLoading,
  setIsPageLoading,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
