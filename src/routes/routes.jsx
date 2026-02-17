import { Routes, Route } from "react-router-dom";
import { Publicpage } from "../components/Pages/Publicpage";
import MyApplicationsPage from "../components/Pages/JobSeeker/MyApplications";
import { UploadCv } from "../components/Pages/CVComponents/UploadCv";
import { Cvs } from "../components/Pages/CVComponents/Cvs";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Puplic page */}
      <Route path="/" element={<Publicpage/>} />
      <Route path="/apps" element={<MyApplicationsPage/>} />
      <Route path='/uploadCv' element={<UploadCv/>}/>
      <Route path='/myCvs' element={<Cvs/>}/>
  
    </Routes>
  );
}
