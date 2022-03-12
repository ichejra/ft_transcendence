import { configureStore } from "@reduxjs/toolkit";
import loggedInReducer from "../features/isLoggedInTestSlice";
import sidebarReducer from "../features/sidebarSlice";
import userProfileReducer from "../features/userProfileSlice";
import friendsManagentReducer from "../features/friendsManagmentSlice";
import globalStateReducer from "../features/globalSlice";

export const store = configureStore({
  reducer: {
    toggleSidebar: sidebarReducer,
    loginStatus: loggedInReducer,
    user: userProfileReducer,
    friends: friendsManagentReducer,
    globalState: globalStateReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
