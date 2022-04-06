import { configureStore } from "@reduxjs/toolkit";
import loggedInReducer from "../features/isLoggedInTestSlice";
import sidebarReducer from "../features/sidebarSlice";
import userProfileReducer from "../features/userProfileSlice";
import friendsManagentReducer from "../features/friendsManagmentSlice";
import globalStateReducer from "../features/globalSlice";
import channelsManagmentReducer from "../features/chatSlice";
import directChatReducer from "../features/directChatslice";

export const store = configureStore({
  reducer: {
    toggleSidebar: sidebarReducer,
    loginStatus: loggedInReducer,
    user: userProfileReducer,
    friends: friendsManagentReducer,
    globalState: globalStateReducer,
    channels: channelsManagmentReducer,
    directChat: directChatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
