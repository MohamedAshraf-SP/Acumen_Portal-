import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllItems } from "../../services/globalService";

// Thunk to fetch items dynamically based on path
export const FetchedItems = createAsyncThunk(
  "data/getAll",
  async ({ path, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await getAllItems(path, page, limit);
      return { path, data: response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

const getAllItemsSlice = createSlice({
  name: "getAll",
  initialState: {
    status: {}, // Track loading status per path
    entities: {}, // Store fetched data per path
    error: {}, // Store error messages per path
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchedItems.pending, (state, action) => {
        const { path } = action.meta.arg;
        state.status[path] = "loading";
        state.error[path] = null; // Clear previous errors on new request
      })
      .addCase(FetchedItems.fulfilled, (state, action) => {
        const { path, data } = action.payload;
        if (path) {
          state.entities[path] = data ?? {}; // Ensure it's always an object
        }
        state.status[path] = "success";
      })
      .addCase(FetchedItems.rejected, (state, action) => {
        const { path } = action.meta.arg;
        state.status[path] = "failed";
        state.error[path] = action.payload ?? "An error occurred";
      });
  },
});

// Export the thunk and reducer
export default getAllItemsSlice.reducer;
