import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const checkIfAuthenticated = async () => {
    try {
      const res =  await apiClient.get("/api/auth/me");
      setIsAuthenticated(true);
    setUser(res.data?.user);
    } catch (error) {
      setIsAuthenticated(false);
        setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIfAuthenticated();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkIfAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
