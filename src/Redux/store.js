import { configureStore } from "@reduxjs/toolkit";
import applicationsReducer from "./applicationSlice";

export const store = configureStore({
  reducer: {
    applications: applicationsReducer,
  },
});

export default store;
