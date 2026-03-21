import { ButtonRedirect } from "../Ui/ButtonRedirect";
import jobIcon from "../../../assets/searchjob.png";
import { useState, useEffect } from "react";

export const PublicHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-3 px-8"
        : "bg-transparent py-5 px-8"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <img src={jobIcon} alt="logo" className="h-5 w-5 object-contain brightness-0 invert" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800">
            Job<span className="text-blue-600">Portal</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
            How It Works
          </a>
          <ButtonRedirect
            link="/register?role=job_seeker"
            buttonName="For Job Seekers"
            style="text-sm font-medium text-slate-600 hover:text-blue-600 bg-transparent hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
          />
          <ButtonRedirect
            link="/register?role=employer"
            buttonName="For Employers"
            style="text-sm font-medium text-slate-600 hover:text-blue-600 bg-transparent hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
          />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ButtonRedirect
            link="/login"
            buttonName="Sign In"
            style="text-sm font-semibold text-slate-700 bg-transparent hover:bg-slate-100 px-4 py-2 rounded-xl transition-all"
          />
          <ButtonRedirect
            link="/register?role=job_seeker"
            buttonName="Get Started"
            style="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-sm transition-all"
          />
        </div>
      </div>
    </header>
  );
};