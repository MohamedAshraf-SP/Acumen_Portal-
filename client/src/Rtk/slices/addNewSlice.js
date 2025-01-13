import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addItem } from "../../services/globalService";

const addNewData = createAsyncThunk(
  "data/addNewData",
  async ({ path, itemData }, thunkAPI) => {
    try {
      const response = await addItem(path, itemData); // Call the service and await the response
 
      return response.data; // Return the actual data if the service succeeds
    } catch (error) {
      // Use `rejectWithValue` to pass error details to the `rejected` case
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong" // Provide a fallback error message
      );
    }
  }
);

const addNewDataSlice = createSlice({
  name: "addnewslice",
  initialState: {
    status: "idle", // Tracks the status: 'idle', 'loading', 'success', or 'failed'
    error: null, // Stores error messages
    data: [], // Holds the successfully added data
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewData.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors when a new request starts
      })
      .addCase(addNewData.fulfilled, (state, action) => {
        state.status = "success";
        state.data.push(action.payload); // Add the new data to the existing array
      })
      .addCase(addNewData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message; // Capture the error message
      });
  },
});

export { addNewData };
export default addNewDataSlice.reducer;
