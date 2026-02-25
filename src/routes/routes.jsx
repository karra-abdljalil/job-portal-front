import { Routes, Route } from "react-router-dom";
import { Publicpage } from "@/pages/Public/Publicpage";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { MagicLinkPageValidation } from "@/pages/auth/MagicLinkPageValidation";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { NotFoundPage } from "@/pages/system/NotFoundPage";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";

import { ADMIN, EMPLOYER, JOB_SEEKER } from "@/constants/userRole";

import MyApplicationsPage from "@/pages/JobSeeker/MyApplications";
import { MyCvs } from "@/pages/JobSeeker/MyCvs";
import ApplyButton from "@/pages/JobSeeker/Apply";
import { Dashboard } from "@/components/layouts/DashboardLayout";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Publicpage />} />

      {/* Guest */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
      <Route path="/verify-email" element={<MagicLinkPageValidation />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

      {/* Dashboard (Nested Layout) */}
      <Route
        path="/jobseeker"
        element={
          <ProtectedRoute role={[JOB_SEEKER,EMPLOYER,ADMIN]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="resumes" element={<MyCvs />} />
        <Route path="apply" element={<ApplyButton />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}