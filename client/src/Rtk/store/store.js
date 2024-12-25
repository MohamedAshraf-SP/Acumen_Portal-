import { configureStore } from "@reduxjs/toolkit";
import settingSlice from "../slices/settingSlice";
import getAllItemsSlice from "../slices/getAllslice";
import addNewDataSlice from "../slices/addNewSlice";
import updateItemSlice from "../slices/updateItemSlice";
import deleteItemSlice from "../slices/deleteItemSlice";

export const store = configureStore({
  reducer: {
    setting: settingSlice,
    getall: getAllItemsSlice,
    AddNew: addNewDataSlice,
    updaateItem: updateItemSlice,
    deleteItem: deleteItemSlice,
  },
});
