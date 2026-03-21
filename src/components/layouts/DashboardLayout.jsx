import { Outlet, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { roleNavigateTo } from "@/constants/roleNavigateto";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Search, Bell, Plus } from "lucide-react";
import { getCompanyLogo } from "@/services/companyLogo.service";
import { getMyCompany } from "@/services/company.service";

const pageTitles = {
  "/employer/dashboard": "Dashboard",
  "/employer/company/profile": "Company Profile",
  "/employer/company/profile/edit": "Edit Company Profile",
  "/employer/jobs": "My Jobs",
  "/employer/jobs/create": "Create Job",
  "/jobseeker/dashboard": "Dashboard",
  "/jobseeker/profile": "My Profile",
  "/jobseeker/resumes": "My Resumes",
  "/jobseeker/applications": "My Applications",
  "/jobseeker/jobs": "Find Jobs",
  "/jobseeker/settings": "Settings",
};

export const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [company, setCompany] = useState(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");

  const navigateto = roleNavigateTo[user?.role] || [];

  const currentTitle =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/employer/jobs/") ? "Job Details" :
     location.pathname.startsWith("/jobseeker/jobs/") ? "Job Details" : "Dashboard");

  useEffect(() => {
    let objectUrl = null;
    const loadEmployerHeaderData = async () => {
      if (user?.role !== "employer") {
        setCompany(null);
        setCompanyLogoUrl("");
        return;
      }
      try {
        const companyRes = await getMyCompany();
        const companyData = companyRes?.company || companyRes?.data?.company || null;
        setCompany(companyData);
        if (companyData?.id) {
          try {
            const blob = await getCompanyLogo();
            objectUrl = URL.createObjectURL(blob);
            setCompanyLogoUrl(objectUrl);
          } catch { setCompanyLogoUrl(""); }
        } else { setCompanyLogoUrl(""); }
      } catch { setCompany(null); setCompanyLogoUrl(""); }
    };
    loadEmployerHeaderData();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [user?.role]);

  const companyInitial = company?.company_name?.trim()?.charAt(0)?.toUpperCase() || "C";
  const userInitials = user?.full_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AppSidebar items={navigateto} />

        <main className="flex-1 overflow-auto">

          {/* ── Header ── */}
          <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur shadow-sm">
            <div className="flex h-14 items-center justify-between gap-4 px-5">

              {/* Left */}
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-slate-500 hover:text-slate-800" />
                <div className="h-5 w-px bg-slate-200" />
                <h1 className="text-sm font-bold text-slate-900">{currentTitle}</h1>
              </div>

              {/* Center - Search */}
              <div className="hidden md:flex flex-1 max-w-sm mx-6">
                <div className="relative w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2">

                {/* Notification bell */}
                <button className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                  <Bell size={15} />
                </button>

                {/* Create Job button - employer only */}
                {user?.role === "employer" && (
                  <Link
                    to="/employer/jobs/create"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={13} /> New Job
                  </Link>
                )}

                {/* User/Company card */}
                <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 ml-1">
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    {companyLogoUrl && user?.role === "employer" ? (
                      <img src={companyLogoUrl} alt="logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user?.role === "employer" ? companyInitial : userInitials}
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user?.role === "employer" ? (company?.company_name || "Company") : user?.full_name}
                    </p>
                    <p className="text-xs text-slate-400 leading-tight capitalize">
                      {user?.role?.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ── Content ── */}
          <div className="p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};