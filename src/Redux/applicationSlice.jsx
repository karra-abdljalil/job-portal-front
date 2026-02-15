import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyApplications } from "../api/ApplicationApi";

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (userId, { rejectWithValue }) => {
    try {
      return await getMyApplications(userId);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load applications";
      });
  },
});

export default applicationsSlice.reducer;
