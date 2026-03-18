import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadProfilePicture,
} from "@/api/ProfileApi";

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getProfile();
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch profile");
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "profile/update",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateProfile(payload);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update profile");
    }
  }
);

export const updatePasswordThunk = createAsyncThunk(
  "profile/updatePassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await updatePassword(payload);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update password");
    }
  }
);

export const uploadPictureThunk = createAsyncThunk(
  "profile/uploadPicture",
  async (file, { rejectWithValue }) => {
    try {
      return await uploadProfilePicture(file);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to upload picture");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user;
        state.successMessage = "Profile updated successfully !";
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updatePasswordThunk.fulfilled, (state) => {
        state.successMessage = "Password updated successfully !";
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(uploadPictureThunk.fulfilled, (state) => {
        state.successMessage = "Picture uploaded successfully !";
      });
  },
});

export const { clearMessages } = profileSlice.actions;
export default profileSlice.reducer;