import {
  download_cv,
  getCv_JobSeeker,
  set_default_cv,
  UploadCv,
  view_cv,
} from "../api/CvApi";
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
// get all cvs
export const fetchMyCvs = createAsyncThunk(
  "cvs/fetchMyCvs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCv_JobSeeker();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// view cv
export const viewCv = createAsyncThunk(
  "cv/viewCv",
  async (cvId, { rejectWithValue }) => {
    try {
      const data = await view_cv(cvId);
      const file = new Blob([data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(file);
      return fileUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
// download
export const downloadCv = createAsyncThunk(
  "cv/download",
  async ({ id, fileName }, { rejectWithValue }) => {
    try {
      const blob = await download_cv(id);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// set as default
export const setDefault = createAsyncThunk(
  "cv/setDefault",
  async (id, { rejectWithValue }) => {
    try {
      await set_default_cv(id);
      return id
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const CvSlice = createSlice({
  name: "cv",
  initialState: {
    items: [],
    loading: false,
    error: null,
    isModalOpen: false,
  },
  reducers: {
    resetCvs: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    closeModal: (state) => {
      state.cvUrl = null;
      state.isModalOpen = false;
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
        state.items = action.payload.data;
      })
      .addCase(fetchMyCvs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // view cv
      .addCase(viewCv.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewCv.fulfilled, (state, action) => {
        state.loading = false;
        state.cvUrl = action.payload;
        state.isModalOpen = true;
      })
      .addCase(viewCv.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to load CV";
      })

      // set as default
      .addCase(setDefault.pending, (state) => {
        state.loading = true;
      })
      .addCase(setDefault.fulfilled, (state, action) => {
        state.loading = false;

        // remove default from all
        state.items = state.items.map((cv) => ({
          ...cv,
          is_default: cv.cv_id === action.payload
        }));
      })
      .addCase(setDefault.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { resetCvs, closeModal } = CvSlice.actions;
export default CvSlice.reducer;
