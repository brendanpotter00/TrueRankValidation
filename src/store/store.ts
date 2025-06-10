import { configureStore } from "@reduxjs/toolkit";
import parksReducer from "./parksSlice";

export const store = configureStore({
  reducer: {
    parks: parksReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
