import {  Route } from "react-router-dom";
import UsersPage from "@/pages/admin/users/Page";
import JobsPage from "@/pages/admin/jobs/Page";
import JobModerationPage from "@/pages/admin/moderations/Page";
import CompaniesPage from "@/pages/admin/companies/Page"
import { ADMIN } from "@/constants/userRole";
import { ProtectedRoute } from "./ProtectedRoute";
import  AdminDashboard  from "@/pages/admin/AdminDashboard";
import { Dashboard } from "@/components/layouts/AdminDashboarLayout"

const adminRoutes = [
  <Route
    path="/admin"
    element={
      <ProtectedRoute role={[ADMIN]}>
        <Dashboard>
          <AdminDashboard />
        </Dashboard>
      </ProtectedRoute>
    }
  >

  
  </Route>,
  
  <Route
    path="/admin/users"
    element={
    <ProtectedRoute role={[ADMIN]}>
      <Dashboard>
        <UsersPage />
      </Dashboard>
    </ProtectedRoute>
    
  }/>,
  <Route
    path="/admin/companies"
    element={
    <ProtectedRoute role={[ADMIN]}>
      <Dashboard>
        <CompaniesPage />
      </Dashboard>
    </ProtectedRoute>
    
  }/>,

  <Route
    path="/admin/jobs"
    element={
    <ProtectedRoute role={[ADMIN]}>
      <Dashboard>
        <JobsPage />
      </Dashboard>
    </ProtectedRoute>
    
  }/>,
  
  <Route
    path="/admin/moderations"
    element={
    <ProtectedRoute role={[ADMIN]}>
      <Dashboard>
        <JobModerationPage />
      </Dashboard>
    </ProtectedRoute>
    
  }/>,
  
  
]

export default adminRoutes;
