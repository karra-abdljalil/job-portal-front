import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/services/api";
import socket from "@/socket";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    apiClient.post("/api/auth/logout");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };
 const checkIfAuthenticated = async () => {
  try {
    const res = await apiClient.get("/api/auth/me");
    setIsAuthenticated(true);
    setUser(res.data?.user);
    return res.data?.user;
  } catch (error) {
    setIsAuthenticated(false);
    setUser(null);
    return null;
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    checkIfAuthenticated();
  }, []);

  useEffect(() => {
   
  if (!isAuthenticated || !user?.id) return ;

  socket.connect();

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);

    // Register user after connection
    socket.emit("registerUser", user.id);
  });

  return () => {
    socket.disconnect();
  };
}, [isAuthenticated, user]);

useEffect(() => {
  if (!isAuthenticated) return;

  const handleStatusUpdate = (data) => {
    console.log("Notification received:", data);

    alert(data.message);
  };

  socket.on("applicationStatusUpdate", handleStatusUpdate);

  return () => {
    socket.off("applicationStatusUpdate", handleStatusUpdate);
  };
}, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkIfAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
