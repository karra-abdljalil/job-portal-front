import { Routes, Route } from "react-router-dom";
import { Publicpage } from "@/pages/Publicpage";
import MyApplicationsPage from "@/pages/JobSeeker/MyApplications";
import { UploadCv } from "../pages/CVComponents/UploadCv";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { NotFoundPage } from "@/pages/system/NotFoundPage";
import { ADMIN, JOB_SEEKER, EMPLOYER } from "@/constants/userRole";
export default function AppRoutes() {
  return (
    <Routes>
      {/* Puplic page */}
      <Route path="/" element={
          <Publicpage />
  
      } />

      <Route
        path="/apps"
        element={
          <ProtectedRoute role={JOB_SEEKER}>
            <MyApplicationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/uploadCv"
        element={
          <ProtectedRoute role={JOB_SEEKER}>
            <UploadCv />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
}
