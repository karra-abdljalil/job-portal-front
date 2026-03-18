import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getEducations, addEducation, updateEducation, deleteEducation } from "@/api/EducationApi";

export const fetchEducations = createAsyncThunk("educations/fetch", async (_, { rejectWithValue }) => {
  try { return await getEducations(); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const addEducationThunk = createAsyncThunk("educations/add", async (payload, { rejectWithValue, dispatch }) => {
  try { await addEducation(payload); dispatch(fetchEducations()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const updateEducationThunk = createAsyncThunk("educations/update", async ({ id, payload }, { rejectWithValue, dispatch }) => {
  try { await updateEducation(id, payload); dispatch(fetchEducations()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const deleteEducationThunk = createAsyncThunk("educations/delete", async (id, { rejectWithValue, dispatch }) => {
  try { await deleteEducation(id); dispatch(fetchEducations()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

const educationSlice = createSlice({
  name: "educations",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducations.pending, (state) => { state.loading = true; })
      .addCase(fetchEducations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.education || [];
      })
      .addCase(fetchEducations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default educationSlice.reducer;