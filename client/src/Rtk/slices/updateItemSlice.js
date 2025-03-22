import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateItem } from "../../services/globalService";
const updateTargetItem = createAsyncThunk(
  "data/updateItem",
  async ({ path, itemId, updatedItemData }, thunkAPI) => {
    try {
      const response = await updateItem(path, itemId, updatedItemData);
     
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error?.message);
    }
  }
);
const updateItemSlice = createSlice({
  name: "UpdateItem",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateTargetItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTargetItem.fulfilled, (state, action) => {
        state.status = "success";
        const updateItem = action.payload;
        state.data = state.data.map((item) =>
          item._id == updateItem._id ? updatedItem : item
        );
      })
      .addCase(updateTargetItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export { updateTargetItem }; // Export your async thunk
export default updateItemSlice.reducer; // Export the reducer
