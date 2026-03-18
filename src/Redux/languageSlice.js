import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLanguages, addLanguage, updateLanguage, deleteLanguage } from "@/api/LanguageApi";

export const fetchLanguages = createAsyncThunk("languages/fetch", async (_, { rejectWithValue }) => {
  try { return await getLanguages(); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const addLanguageThunk = createAsyncThunk("languages/add", async (payload, { rejectWithValue, dispatch }) => {
  try { await addLanguage(payload); dispatch(fetchLanguages()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const updateLanguageThunk = createAsyncThunk("languages/update", async ({ id, payload }, { rejectWithValue, dispatch }) => {
  try { await updateLanguage(id, payload); dispatch(fetchLanguages()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const deleteLanguageThunk = createAsyncThunk("languages/delete", async (id, { rejectWithValue, dispatch }) => {
  try { await deleteLanguage(id); dispatch(fetchLanguages()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

const languageSlice = createSlice({
  name: "languages",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => { state.loading = true; })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.languages || [];
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default languageSlice.reducer;