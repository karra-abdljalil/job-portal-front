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
import CandidateCardTest from "@/pages/system/CandidateCardTest";
import ApplicantsPage from "@/pages/Employer/ApplicantsPage";
import CompanyProfilePage from "@/pages/Employer/CompanyProfilePage";
import CompanyProfileEditPage from "@/pages/Employer/CompanyProfileEditPage";

import ProfilePage from "@/pages/JobSeeker/Profile";
import SettingsPage from "@/pages/JobSeeker/Settings";
import DashboardJobSeeker from "@/pages/JobSeeker/DashboardJobSeeker";
import JobsPage from "@/pages/JobSeeker/Jobs";
import JobDetailPage from "@/pages/JobSeeker/JobDetail";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Publicpage />} />
      <Route path="/test-candidate-card" element={<CandidateCardTest />} />

      {/* Guest */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
      <Route path="/verify-email" element={<MagicLinkPageValidation />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

      {/* Dashboard Jobseeker */}
      <Route
        path="/jobseeker"
        element={
          <ProtectedRoute role={[JOB_SEEKER]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="resumes" element={<MyCvs />} />
        <Route path="candidates-test" element={<CandidateCardTest />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="dashboard" element={<DashboardJobSeeker />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        
      </Route>

      {/* Dashboard Employer */}
      <Route
        path="/employer"
        element={
          <ProtectedRoute role={[EMPLOYER, ADMIN]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="company/profile" element={<CompanyProfilePage />} />
        <Route path="company/profile/edit" element={<CompanyProfileEditPage />} />
        <Route path="jobs/:jobId/applicants" element={<ApplicantsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}