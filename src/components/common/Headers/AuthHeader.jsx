import jobIcon from "../../../assets/searchjob.png";
import apiClient from "@/services/api";
export const AuthHeader = () => {

  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      
      {/* Left: Logo + App Name */}
      <div className="flex items-center gap-3">
        <img
          src={jobIcon}
          alt="JobPortal logo"
          className="h-10 w-10 object-contain text-blue-700"
        />
        <span className="text-xl font-bold text-gray-800">
          Job<span className="text-sky-700">Portal</span> 
        </span>
      </div>

     

    </header>
  );
};
