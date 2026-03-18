import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJobs, getJobById, saveJob, getSavedJobs,unsaveJob } from "@/api/JobSeekerJobApi";

export const fetchJobs = createAsyncThunk("jobSeekerJobs/fetch", async (params, { rejectWithValue }) => {
  try { return await getJobs(params); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const fetchJobById = createAsyncThunk("jobSeekerJobs/fetchById", async (id, { rejectWithValue }) => {
  try { return await getJobById(id); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const saveJobThunk = createAsyncThunk("jobSeekerJobs/save", async (jobId, { rejectWithValue }) => {
  try { return await saveJob(jobId); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const unsaveJobThunk = createAsyncThunk("jobSeekerJobs/unsave", async (jobId, { rejectWithValue, dispatch }) => {
  try {
    await unsaveJob(jobId);
    dispatch(fetchSavedJobs());
  }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const fetchSavedJobs = createAsyncThunk("jobSeekerJobs/fetchSaved", async (_, { rejectWithValue }) => {
  try { return await getSavedJobs(); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

const jobSeekerJobSlice = createSlice({
  name: "jobSeekerJobs",
  initialState: {
    items: [],
    savedJobs: [],
    currentJob: null,
    loading: false,
    error: null,
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.pagination = action.payload?.pagination || state.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => { state.loading = true; })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload?.data || null;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSavedJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload?.jobs || [];
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobSeekerJobSlice.reducer;