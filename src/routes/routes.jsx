import { Routes, Route } from "react-router-dom";
import { Publicpage } from "../components/layouts/Publicpage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Puplic page */}
      <Route path="/" element={<Publicpage/>} />
  
    </Routes>
  );
}
