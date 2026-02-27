import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "@/pages/system/Loading";

export const ProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role.includes(user?.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};