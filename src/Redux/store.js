import { configureStore } from "@reduxjs/toolkit";
import applicationsReducer from "./applicationSlice";
import cvReducer from "./cvSlice";
import profileReducer from "./profileSlice";
import skillReducer from "./skillSlice";
import experienceReducer from "./experienceSlice";
import educationReducer from "./educationSlice";
import languageReducer from "./languageSlice";
import dashboardJobSeekerReducer from "./dashboardJobSeekerSlice";
import jobSeekerJobReducer from "./jobSeekerJobSlice";
import certificationReducer from "./certificationSlice";

export const store = configureStore({
  reducer: {
    dashboardJobSeeker: dashboardJobSeekerReducer,
    applications: applicationsReducer,
    cv:cvReducer,
    profile: profileReducer,
    skills: skillReducer,
    experiences: experienceReducer,
    educations: educationReducer,
    languages: languageReducer,
    jobSeekerJobs: jobSeekerJobReducer,
    certifications: certificationReducer,
  },
});

export default store;
