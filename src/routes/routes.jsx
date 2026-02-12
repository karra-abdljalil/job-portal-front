import { Routes, Route } from "react-router-dom";
import { Publicpage } from "../components/layouts/Publicpage";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { NotFoundPage } from "@/pages/system/NotFoundPage";
import {ADMIN,JOB_SEEKER,EMPLOYER} from "@/constants/userRole"
export default function AppRoutes() {
  return (
    <Routes>
      {/* Puplic page */}
      <Route path="/" element={<Publicpage/>} />
      <Route path="/login" element={
                <GuestRoute>
                    <Login/>
                 </GuestRoute>
          }/>
      <Route path="/register" element={
        <GuestRoute>
            <Register/>
        </GuestRoute>
        } />
    <Route path="/*" element={<NotFoundPage/>} />
    </Routes>
  );
}
