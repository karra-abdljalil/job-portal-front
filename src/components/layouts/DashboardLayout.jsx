import { Outlet, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { roleNavigateTo } from "@/constants/roleNavigateto";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Search, Bell, BriefcaseBusiness } from "lucide-react";
import { getCompanyLogo } from "@/services/companyLogo.service";
import { getMyCompany } from "@/services/company.service";

const pageTitles = {
  "/employer/dashboard": "Employer Dashboard",
  "/employer/company/profile": "Company Profile",
  "/employer/company/profile/edit": "Edit Company Profile",
  "/employer/jobs": "My Jobs",
  "/employer/jobs/create": "Create Job",
};

export const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [company, setCompany] = useState(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");

  const navigateto = roleNavigateTo[user?.role] || [];

  const currentTitle =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/employer/jobs/")
      ? "Job Details"
      : "Dashboard");

  const userInitials =
    user?.full_name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

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
          } catch (logoErr) {
            console.warn("Impossible de charger le logo entreprise :", logoErr);
            setCompanyLogoUrl("");
          }
        } else {
          setCompanyLogoUrl("");
        }
      } catch (err) {
        console.error("Erreur chargement company header:", err);
        setCompany(null);
        setCompanyLogoUrl("");
      }
    };

    loadEmployerHeaderData();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user?.role]);

  const companyInitial =
    company?.company_name?.trim()?.charAt(0)?.toUpperCase() || "C";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f3f2ef]">
        <AppSidebar items={navigateto} />

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-20 border-b border-[#e0dfdc] bg-white/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {currentTitle}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Welcome back{user?.full_name ? `, ${user.full_name}` : ""}
                  </p>
                </div>
              </div>

              <div className="hidden max-w-xl flex-1 items-center md:flex">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, candidates..."
                    className="w-full rounded-full border border-[#d0d7de] bg-[#f8fafc] py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#0a66c2] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hidden rounded-full border border-[#d0d7de] p-2 text-gray-600 transition hover:bg-gray-50 md:inline-flex"
                >
                  <Bell className="h-4 w-4" />
                </button>

                {user?.role === "employer" && (
                  <Link
                    to="/employer/jobs/create"
                    className="hidden rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#004182] md:inline-flex"
                  >
                    <BriefcaseBusiness className="mr-2 h-4 w-4" />
                    Create Job
                  </Link>
                )}

                <div className="flex items-center gap-3 rounded-2xl border border-[#e0dfdc] bg-white px-3 py-2 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#e0dfdc] bg-white">
                    {companyLogoUrl ? (
                      <img
                        src={companyLogoUrl}
                        alt="Company logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#0a66c2] text-sm font-bold text-white">
                        {companyInitial}
                      </div>
                    )}
                  </div>

                  <div className="hidden min-w-[160px] md:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {company?.company_name || "Entreprise"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.full_name || "Employer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};