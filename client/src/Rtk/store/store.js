import { configureStore } from "@reduxjs/toolkit";
import settingSlice from "../slices/settingSlice";

export const store = configureStore({
  reducer: {
    setting: settingSlice,
  },
});
