import { configureStore } from "@reduxjs/toolkit";
import parksReducer from "./parksSlice";
import type { RootState } from "./types";

export const store = configureStore({
  reducer: {
    parks: parksReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
