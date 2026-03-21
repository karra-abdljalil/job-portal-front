import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCompany } from "../../services/company.service";
import { getCompanyLogo } from "../../services/companyLogo.service";
import CompanyLinkedInHero from "../../components/employer/CompanyLinkedInHero";
import CompanyLinkedInTabs from "../../components/employer/CompanyLinkedInTabs";
import CompanyAboutCard from "../../components/employer/CompanyAboutCard";
import CompanyRightSidebar from "../../components/employer/CompanyRightSidebar";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Accueil");
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl = null;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const companyRes = await getMyCompany();
        const data = companyRes?.company || null;

        if (!data) {
          setCompany(null);
          return;
        }

        let logoUrl = "";

        try {
          const blob = await getCompanyLogo();
          objectUrl = URL.createObjectURL(blob);
          logoUrl = objectUrl;
        } catch (e) {
          logoUrl = "";
        }

        setCompany({
          id: data.id,
          company_name: data.company_name || "",
          description: data.description || "",
          industry: data.industry || "",
          location: data.location || "",
          logo: data.logo || "",
          logoUrl,
        });
      } catch (err) {
        console.error("Company profile load error:", err);
        setError(
          err?.response?.data?.message ||
            "Unable to load the company profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f2ee] py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-medium text-slate-600">
              Loading company profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f2ee] py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#f4f2ee] py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
              Company Profile
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              No company profile found
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              You need to create your company profile first before you can view
              and manage it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/employer/company/profile/edit"
                className="rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
              >
                Create Company Profile
              </Link>

              <Link
                to="/employer/dashboard"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Accueil":
      case "À propos":
        return <CompanyAboutCard company={company} />;

      case "Posts":
        return (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Posts
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                No posts available at the moment.
              </p>
            </div>
          </div>
        );

      case "Emplois":
        return (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Jobs
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Company job opportunities will be displayed here soon.
              </p>
            </div>
          </div>
        );

      case "Personnes":
        return (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                People
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Company members will be displayed here soon.
              </p>
            </div>
          </div>
        );

      default:
        return <CompanyAboutCard company={company} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
          <div className="space-y-5">
            <CompanyLinkedInHero company={company} />

            <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <CompanyLinkedInTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {renderTabContent()}
          </div>

          <CompanyRightSidebar company={company} />
        </div>
      </div>
    </div>
  );
}