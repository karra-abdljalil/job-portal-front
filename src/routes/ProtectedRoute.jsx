import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "@/pages/system/Loading";

export const ProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  /*
  ==============================
  🔒 CODE ORIGINAL (NE PAS SUPPRIMER)
  ==============================

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
  */

  /*
  ==============================
  🚀 MODE DÉVELOPPEMENT (TEMPORAIRE)
  ==============================
  Permet d'accéder à toutes les pages
  sans login ni vérification de rôle.
  À remettre comme avant après le développement.
  */
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