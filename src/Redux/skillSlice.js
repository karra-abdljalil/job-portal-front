import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMySkills, getAllSkills, addSkillToProfile, removeSkillFromProfile, createSkill } from "@/api/SkillApi";

export const fetchMySkills = createAsyncThunk("skills/fetchMine", async (_, { rejectWithValue }) => {
  try { return await getMySkills(); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const fetchAllSkills = createAsyncThunk("skills/fetchAll", async (_, { rejectWithValue }) => {
  try { return await getAllSkills(); }
  catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const addSkillThunk = createAsyncThunk("skills/add", async (skillId, { rejectWithValue, dispatch }) => {
  try {
    await addSkillToProfile(skillId);
    dispatch(fetchMySkills());
  } catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const removeSkillThunk = createAsyncThunk("skills/remove", async (skillId, { rejectWithValue, dispatch }) => {
  try {
    await removeSkillFromProfile(skillId);
    dispatch(fetchMySkills());
  } catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

export const createSkillThunk = createAsyncThunk("skills/create", async (payload, { rejectWithValue, dispatch }) => {
  try {
    await createSkill(payload);
    dispatch(fetchAllSkills());
  } catch (e) { return rejectWithValue(e?.message || "Failed"); }
});

const skillSlice = createSlice({
  name: "skills",
  initialState: { mySkills: [], allSkills: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySkills.pending, (state) => { state.loading = true; })
      .addCase(fetchMySkills.fulfilled, (state, action) => {
        state.loading = false;
        state.mySkills = action.payload?.skills || [];
      })
      .addCase(fetchMySkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllSkills.fulfilled, (state, action) => {
        state.allSkills = action.payload?.skills || [];
      });
  },
});

export default skillSlice.reducer;