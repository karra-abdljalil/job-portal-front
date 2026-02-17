import { getCv_JobSeeker, UploadCv } from "../api/CvApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const uploadCvThunk = createAsyncThunk(
  "cv/upload",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const res = await UploadCv(formData, id);
      return res.data.newCv;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  },
);

export const fetchMyCvs = createAsyncThunk(
  "cvs/fetchMyCvs",
  async (id, { rejectWithValue }) => {
    try {
      return await getCv_JobSeeker(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const CvSlice = createSlice({
  name: "cvs",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetCvs: (state) => {
        state.items = []
        state.loading = false
        state.error = null
    },
  },
  extraReducers: (builder) => {
     // upload cv
    builder
      .addCase(uploadCvThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadCvThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(uploadCvThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    //   get cvs
      .addCase(fetchMyCvs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyCvs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload
      })
      .addCase(fetchMyCvs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCvs } = CvSlice.actions;
export default CvSlice.reducer;
