import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getItem } from "../../services/globalService"; // Your API function

// Async thunk to fetch company details
export const fetchCompanyDetails = createAsyncThunk(
  "company/fetchCompanyDetails",
  async ({ companyId, companyCode, subRoute = "" }, { rejectWithValue }) => {
    console.log(companyId, companyCode, subRoute);
    try {
      let path;

      if (companyId) {
        path = `companies`; // Include subRoute if provided
      } else {
        path = `companyHouse/company`;
      }

      const response = await getItem(path, companyId ? companyId : companyCode);
      return response;
    } catch (error) {
      console.error("Error fetching company details", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch company details"
      );
    }
  }
);

const Fetchcompanydetails = createSlice({
  name: "companyDetails",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCompany: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompany } = Fetchcompanydetails.actions;
export default Fetchcompanydetails.reducer;
