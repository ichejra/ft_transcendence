import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
export interface User {
  id: number;
  display_name: string;
  user_name: string;
  email?: string;
  avatar_url: string;
  is_active: boolean;
  state: string;
  createdAt: string;
  is_2fa_enabled: boolean;
}

interface History {
  id: number;
  score: string;
  playedAt: string;
  winner: User;
  loser: User;
}
interface UserState {
  isLoading: boolean;
  isPageLoading: boolean;
  error: { status: number; message: string };
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
  qrCode: string;
  isVerified: boolean;
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
  is_2fa_enabled: false,
};

const initialState: UserState = {
  isLoading: false,
  isPageLoading: false,
  error: { status: 200, message: "OK" },
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
  qrCode: "",
  isVerified: false,
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
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
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
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
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

export const fetchUserGameHistory = createAsyncThunk(
  "users/fetchUserGameHistory",
  async (userId: number, _api) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/games/user/${userId}`,
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

export const enableTwoFactorAuth = createAsyncThunk(
  "users/enableTwoFactorAuth",
  async (_, _api) => {
    try {
      const response = await axios.get("http://localhost:3001/api/2fa/enable", {
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

export const generate2FAQrCode = createAsyncThunk(
  "users/generate2FAQrCode",
  async (_, _api) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/2fa/generate",
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

export const verify2FACode = createAsyncThunk(
  "users/verify2FACode",
  async (verificationCode: string, _api) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/2fa/verify",
        { code: verificationCode },
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

export const disableTwoFactorAuth = createAsyncThunk(
  "users/disableTwoFactorAuth",
  async (_, _api) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/2fa/disable",
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
    } catch (error: any) {
      return _api.rejectWithValue(error.message);
    }
  }
);

export const completeProfileInfo = createAsyncThunk(
  "user/completeProfileInfo",
  async ({ data }: { data: FormData }, _api) => {
    try {
      console.log("");
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
      console.log();
      return _api.rejectWithValue(error.message);
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
    //* No relation users
    builder.addCase(fetchNoRelationUsers.fulfilled, (state, action: any) => {
      state.nrusers = action.payload;
    });
    builder.addCase(fetchNoRelationUsers.rejected, (state, action: any) => {});

    //* All users
    builder.addCase(fetchAllUsers.fulfilled, (state, action: any) => {
      state.users = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action: any) => {});

    //* Logged user
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: any) => {
      state.loggedUser = action.payload;
      if (state.loggedUser.user_name) {
        state.completeInfo = true;
      }
      state.isLoggedIn = true;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action: any) => {});

    //* User game history
    builder.addCase(fetchUserGameHistory.fulfilled, (state, action: any) => {
      state.gameHistory = action.payload;
    });

    //* enable 2fa
    builder.addCase(enableTwoFactorAuth.fulfilled, (state) => {
      state.loggedUser.is_2fa_enabled = true;
    });
    builder.addCase(enableTwoFactorAuth.rejected, (state, action: any) => {});

    //* genrate qrCode
    builder.addCase(generate2FAQrCode.fulfilled, (state, action: any) => {
      state.qrCode = action.payload;
    });
    builder.addCase(generate2FAQrCode.rejected, (state, action: any) => {});

    //* check 2fa verification
    builder.addCase(verify2FACode.fulfilled, (state) => {
      state.isVerified = true;
    });
    builder.addCase(verify2FACode.rejected, (state) => {
      state.isVerified = false;
    });

    //* disable 2fa
    builder.addCase(disableTwoFactorAuth.fulfilled, (state) => {
      state.loggedUser.is_2fa_enabled = false;
    });
    builder.addCase(disableTwoFactorAuth.rejected, (state, action: any) => {});

    //* Single user
    builder.addCase(fetchSingleUser.fulfilled, (state, action: any) => {
      state.user = action.payload;
    });
    builder.addCase(fetchSingleUser.rejected, (state, action: any) => {});

    //* Set logged user username
    builder.addCase(completeProfileInfo.fulfilled, (state, action: any) => {
      state.loggedUser = action.payload;
      state.completeInfo = true;
      state.isLoading = false;
    });
    builder.addCase(completeProfileInfo.pending, (state, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(completeProfileInfo.rejected, (state, action: any) => {
      state.error = { status: 403, message: "This username is not available" };
      state.isLoading = false;
    });

    //* User friends
    builder.addCase(fetchUserFriends.fulfilled, (state, action: any) => {
      state.friends = action.payload;
    });
    builder.addCase(fetchUserFriends.rejected, (state, action: any) => {});
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
