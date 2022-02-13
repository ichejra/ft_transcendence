import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../features/sidebarSlice";

export const store = configureStore({
  reducer: {
    toggleSidebar: sidebarReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
