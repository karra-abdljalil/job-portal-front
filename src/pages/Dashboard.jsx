import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { ADMIN, JOB_SEEKER, EMPLOYER } from "@/constants/userRole";

export default function Dashboard() {

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (user?.role === ADMIN) {
    return <Navigate to="/admin" />;
  }

  if (user?.role === JOB_SEEKER) {
    return <Navigate to="/job-seeker" />;
  }

  if (user?.role === EMPLOYER) {
    return <Navigate to="/employer" />;
  }

  return null;
}