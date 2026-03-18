import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getExperiences, addExperience, updateExperience, deleteExperience } from "@/api/ExperienceApi";

export const fetchExperiences = createAsyncThunk("experiences/fetch", async (_, { rejectWithValue }) => {
  try { return await getExperiences(); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const addExperienceThunk = createAsyncThunk("experiences/add", async (payload, { rejectWithValue, dispatch }) => {
  try { await addExperience(payload); dispatch(fetchExperiences()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const updateExperienceThunk = createAsyncThunk("experiences/update", async ({ id, payload }, { rejectWithValue, dispatch }) => {
  try { await updateExperience(id, payload); dispatch(fetchExperiences()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const deleteExperienceThunk = createAsyncThunk("experiences/delete", async (id, { rejectWithValue, dispatch }) => {
  try { await deleteExperience(id); dispatch(fetchExperiences()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

const experienceSlice = createSlice({
  name: "experiences",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiences.pending, (state) => { state.loading = true; })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.experiences || [];
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default experienceSlice.reducer;