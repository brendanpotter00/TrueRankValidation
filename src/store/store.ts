import { configureStore } from "@reduxjs/toolkit";
import parksReducer from "./parksSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    parks: parksReducer,
    ui: uiReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
