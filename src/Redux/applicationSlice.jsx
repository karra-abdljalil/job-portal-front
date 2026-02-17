import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  decideOffer,
  getMyApplications_JobSeeker,
} from "../api/ApplicationApi";

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async ({ search, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      return await getMyApplications_JobSeeker(search, page, limit);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  },
);

export const decideOfferThunk = createAsyncThunk(
  "applications/decideOffer",
  async ({ appId, decision }, { rejectWithValue }) => {
    try {
      const res = await decideOffer(appId, decision);
      return res.updateApplication;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  },
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasMore: false,
    },
    counts: {
      total_app: 0,
      applied_app: 0,
      underReview_app: 0,
      offer_app: 0,
      interview_app: 0,
      rejected_app: 0,
    },
  },
  reducers: {
    resetApplications: (state) => {
      state.items = [];
      state.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasMore: false,
      };
      state.counts = {
        total_app: 0,
        applied_app: 0,
        underReview_app: 0,
        offer_app: 0,
        interview_app: 0,
        rejected_app: 0,
      };
    },
     optimisticUpdate: (state, action) => {
    const index = state.items.findIndex((app) => app.id === action.payload.id);
    if (index !== -1) state.items[index].status = action.payload.status;
  },
  },
  extraReducers: (builder) => {
    builder
      // get app as jobSeeker
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.applications;
        state.pagination = action.payload.pagination;
        state.counts = action.payload.counts;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load applications";
      })

      // send email
      .addCase(decideOfferThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(decideOfferThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (app) => app.id === action.payload.id,
        );
        if (index !== -1) state.items[index] = action.payload;
        state.loading = false;
      })
      .addCase(decideOfferThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetApplications,optimisticUpdate  } = applicationsSlice.actions;
export default applicationsSlice.reducer;
