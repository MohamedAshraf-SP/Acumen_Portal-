import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteItem } from "../../services/globalService";

const deleteTargetItem = createAsyncThunk(
  "data/deleteItem",
  async ({ path, itemId }, thunkAPI) => {
    try {
      const response = await deleteItem(path, itemId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message // Safe fallback for errors
      );
    }
  }
);
const deleteItemSlice = createSlice({
  name: "deleteItem",
  initialState: {
    error: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteTargetItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTargetItem.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(deleteTargetItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export { deleteTargetItem }; // Export your async thunk
export default deleteItemSlice.reducer; // Export the reducer
