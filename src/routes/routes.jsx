import { Routes, Route } from "react-router-dom";
import { Publicpage } from "../components/Pages/Publicpage";
import MyApplicationsPage from "../components/Pages/JobSeeker/MyApplications";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Puplic page */}
      <Route path="/" element={<Publicpage/>} />
      <Route path="/apps" element={<MyApplicationsPage/>} />
  
    </Routes>
  );
}
