import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addItem } from "../../services/globalService";

const addNewData = createAsyncThunk(
  "data/addNewData",
  async ({ path, itemData }, thunkAPI) => {
    try {
      const response = await addItem(path, itemData); // Call the service
  
      return { path, ...response }; // Ensure full response is returned
    } catch (error) {
     // console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const addDataSlice = createSlice({
  name: "addData",
  initialState: {
    status: "idle",
    error: null,
    data: [],
  },
  reducers: {
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
        state.error = null;
      })
      .addCase(addNewData.fulfilled, (state, action) => {
        state.status = "success";
        state.data.push(action.payload); // Push new data instead of overwriting
      })
      .addCase(addNewData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Ensure proper error message
      });
  },
});

export const { resetState } = addDataSlice.actions;
export { addNewData };
export default addDataSlice.reducer;
