import { Routes, Route } from "react-router-dom";
import { Publicpage } from "@/pages/Publicpage";
import MyApplicationsPage from "@/pages/JobSeeker/MyApplications";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { MagicLinkPageValidation } from "@/pages/auth/MagicLinkPageValidation";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { NotFoundPage } from "@/pages/system/NotFoundPage";
import { JOB_SEEKER } from "@/constants/userRole";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { MyCvs } from "@/pages/JobSeeker/MyCvs";
import ApplyButton from "@/pages/JobSeeker/Apply";
export default function AppRoutes() {
  return (
    <Routes>
      {/* Puplic page */}
      <Route path="/" element={<Publicpage />} />

      <Route
        path="/apps"
        element={
          <ProtectedRoute role={JOB_SEEKER}>
            <MyApplicationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/myResumes"
        element={
          <ProtectedRoute role={JOB_SEEKER}>
            <MyCvs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply"
        element={
          <ProtectedRoute role={JOB_SEEKER}>
            <ApplyButton />
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
      <Route path="/" element={<Publicpage />} />
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
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />
      <Route path="/verify-email" element={<MagicLinkPageValidation />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
}
