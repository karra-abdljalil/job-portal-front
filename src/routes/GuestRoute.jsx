import { roleRedirect } from '@/constants/roleNavigateto'
import {useAuth} from "@/contexts/AuthContext"
import Loading from "@/pages/system/Loading";
import { Navigate } from "react-router-dom";
export const GuestRoute = ({ children }) => {
  const { isAuthenticated ,user,isLoading } = useAuth();

  if(isLoading) return <Loading/>

  if (isAuthenticated) {
    return <Navigate to={roleRedirect[user?.role]} replace />;
  }

  return children;
};
