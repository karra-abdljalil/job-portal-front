import { Routes, Route } from "react-router-dom";
import UsersPage from "@/pages/admin/users/Page";
import JobsPage from "@/pages/admin/jobs/Page";
import { ADMIN, EMPLOYER, JOB_SEEKER } from "@/constants/userRole";
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
    path="/admin/jobs"
    element={
    <ProtectedRoute role={[ADMIN]}>
      <Dashboard>
        <JobsPage />
      </Dashboard>
    </ProtectedRoute>
    
  }/>,
  
  // <Route
  //   path="/admin"
  //   element={
  //     <ProtectedRoute role={[ADMIN]}>
  //       <AdminDashboard />
  //     </ProtectedRoute>
  //   }
  // ></Route>,  
  // <Route path="/users" element={
  //   <ProtectedRoute role={ADMIN}>
  //     <UsersPage />
  //   </ProtectedRoute>
  // } />,
  
]

export default adminRoutes;
