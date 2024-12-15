import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllItems } from "../../services/globalService";

// Thunk to fetch items based on the provided path
const FetchedItems = createAsyncThunk("data/getAll", async (path, thunkAPI) => {
  try {
    const response = await getAllItems(path); // Fetch data for the specified path
    return { path, data: response }; // Include the path and fetched data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const getAllItemsSlice = createSlice({
  name: "getAll",
  initialState: {
    status: "idle",
    entities: {}, // Changed to an object to store data dynamically
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchedItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(FetchedItems.fulfilled, (state, action) => {
        const { path, data } = action.payload; // Destructure path and data from payload
        state.status = "success";
        state.entities[path] = data; // Dynamically set data for the specific path
      })
      .addCase(FetchedItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

// Export the thunk and reducer
export { FetchedItems };
export default getAllItemsSlice.reducer;
