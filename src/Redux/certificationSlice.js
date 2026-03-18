import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCertifications, createCertification, updateCertification, deleteCertification } from "@/api/CertificationApi";

export const fetchCertifications = createAsyncThunk("certifications/fetch", async (_, { rejectWithValue }) => {
  try { return await getCertifications(); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const createCertificationThunk = createAsyncThunk("certifications/create", async (formData, { rejectWithValue, dispatch }) => {
  try { await createCertification(formData); dispatch(fetchCertifications()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const updateCertificationThunk = createAsyncThunk("certifications/update", async ({ id, payload }, { rejectWithValue, dispatch }) => {
  try { await updateCertification(id, payload); dispatch(fetchCertifications()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const deleteCertificationThunk = createAsyncThunk("certifications/delete", async (id, { rejectWithValue, dispatch }) => {
  try { await deleteCertification(id); dispatch(fetchCertifications()); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

const certificationSlice = createSlice({
  name: "certifications",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertifications.pending, (state) => { state.loading = true; })
      .addCase(fetchCertifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.certifications || [];
      })
      .addCase(fetchCertifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default certificationSlice.reducer;