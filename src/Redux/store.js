import { configureStore } from "@reduxjs/toolkit";
import applicationsReducer from "./applicationSlice";
import cvReducer from "./cvSlice";

export const store = configureStore({
  reducer: {
    applications: applicationsReducer,
    cv:cvReducer
  },
});

export default store;
