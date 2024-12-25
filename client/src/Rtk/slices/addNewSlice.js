import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addItem } from "../../services/globalService";

const addNewData = createAsyncThunk(
  "data/addNewData", // Fixed typo in the action type name
  async ({ path, itemData }, thunkAPI) => {
    console.log(itemData)
    try {

      const response = await addItem(path, itemData); // Added `await` to handle the promise
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message // Safe fallback for errors
      );
    }
  }
);

const addNewDataSlice = createSlice({
  name: "addnewslice",
  initialState: {
    status: "idle",
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewData.pending, (state) => {
        state.status = "loading";
        state.error = null; // Reset error on a new request
      })
      .addCase(addNewData.fulfilled, (state, action) => {
        // Added `action` parameter
        state.status = "success";
        state.data.push(action.payload); // Use `action.payload` correctly
      })
      .addCase(addNewData.rejected, (state, action) => {
        // Added `action` parameter
        state.status = "failed";
        state.error = action.payload || action.error.message; // Handle both `rejectWithValue` and generic errors
      });
  },
});

export { addNewData }; // Export your async thunk
export default addNewDataSlice.reducer; // Export the reducer
