import {useAuth} from "@/contexts/AuthContext"
import { Login } from "@/pages/auth/Login";
import { Forbidden } from "@/pages/system/Forbidden";

import Loading from "@/pages/system/Loading";
export const ProtectedRoute = ({role, children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }
   if (!role.includes(user?.role)) {
    return <Forbidden />;
  }
  

  return children;
};
