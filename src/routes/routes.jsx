import { Routes, Route } from "react-router-dom";
import { Publicpage } from "@/pages/Public/Publicpage";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { MagicLinkPageValidation } from "@/pages/auth/MagicLinkPageValidation";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { NotFoundPage } from "@/pages/system/NotFoundPage";
import { Forbidden } from "@/pages/system/Forbidden";
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
import EmployerDashboardPage from "@/pages/Employer/EmployerDashboardPage";
import MyJobsPage from "@/pages/Employer/MyJobsPage";
import EmployerJobDashboardPage from "@/pages/Employer/EmployerJobDashboardPage";
import CreateJobPage from "@/pages/Employer/CreateJobPage";
import EditJobPage from "@/pages/Employer/EditJobPage";
import EmployerShortlistPage from "@/pages/Employer/EmployerShortlistPage";

import AdminRoutes from "./AdminRoutes";
import DashboardApp from "@/pages/Dashboard"
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Publicpage />} />
      <Route path="/test-candidate-card" element={<CandidateCardTest />} />

      {/* Guest */}
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

      <Route path="/dashboard" element={<DashboardApp />} />
      {/* Dashboard Jobseeker */}
      <Route
        path="/jobseeker"
        element={
          <ProtectedRoute role={[JOB_SEEKER,ADMIN]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="resumes" element={<MyCvs />} />
        <Route path="apply" element={<ApplyButton />} />
        <Route path="candidates-test" element={<CandidateCardTest />} />
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
  <Route path="dashboard" element={<EmployerDashboardPage />} />
  <Route path="company/profile" element={<CompanyProfilePage />} />
  <Route path="company/profile/edit" element={<CompanyProfileEditPage />} />
  <Route path="jobs" element={<MyJobsPage />} />
  <Route path="jobs/create" element={<CreateJobPage />} />
  <Route path="jobs/:jobId" element={<EmployerJobDashboardPage />} />
  <Route path="jobs/:jobId/edit" element={<EditJobPage />} />
  <Route path="jobs/:jobId/applicants" element={<ApplicantsPage />} />
  <Route path="jobs/:jobId/shortlist" element={<EmployerShortlistPage />} />
</Route>

{/* ✅ AJOUT ICI */}
{AdminRoutes}

{/* 403*/}
<Route path="/forbidden" element={<Forbidden />} />
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
