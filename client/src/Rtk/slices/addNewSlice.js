import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addItem } from "../../services/globalService";

const addNewData = createAsyncThunk(
  "data/addNewData",
  async ({ path, itemData }, thunkAPI) => {
    try {
      const response = await addItem(path, itemData); // Call the service
      return { path, data: response.data }; // Return the data
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || error?.message);
    }
  }
);

const addDataSlice = createSlice({
  name: "addData",
  initialState: {
    status: "idle", // Tracks the status: 'idle', 'loading', 'success', or 'failed'
    error: null, // Stores error messages
    data: [], // Holds the successfully added data
  },
  reducers: {
    // Optional: Add reducers for clearing/resetting the state if needed
    resetState: (state) => {
      state.status = "idle";
      state.error = null;
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewData.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors when a new request starts
      })
      .addCase(addNewData.fulfilled, (state, action) => {
        state.status = "success";
        state.data = [...state.data, action.payload]; // Add the new data to the existing array
        // Reset state fields to default values
 
      })
      .addCase(addNewData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message; // Capture the error message
      });
  },
});

export const { resetState } = addDataSlice.actions; // Export the reset action if needed
export { addNewData };
export default addDataSlice.reducer;
