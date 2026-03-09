import React, { useEffect, useState } from "react";
import { getMyCompany } from "../../services/company.service";
import { getCompanyLogo } from "../../services/companyLogo.service";
import CompanyLinkedInHero from "../../components/employer/CompanyLinkedInHero";
import CompanyLinkedInTabs from "../../components/employer/CompanyLinkedInTabs";
import CompanyAboutCard from "../../components/employer/CompanyAboutCard";
import CompanyRightSidebar from "../../components/employer/CompanyRightSidebar";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState({
    company_name: "",
    description: "",
    industry: "",
    location: "",
    logoUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Accueil");

  useEffect(() => {
    let objectUrl = null;

    const fetchData = async () => {
      try {
        const companyRes = await getMyCompany();
        const data = companyRes.company || companyRes.data || companyRes;

        let logoUrl = "";

        try {
          const blob = await getCompanyLogo();
          objectUrl = URL.createObjectURL(blob);
          logoUrl = objectUrl;
        } catch (e) {
          logoUrl = "";
        }

        setCompany({
          company_name: data.company_name || "",
          description: data.description || "",
          industry: data.industry || "",
          location: data.location || "",
          logoUrl,
        });
      } catch (err) {
        console.error("Company profile load error:", err);
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
      <div className="min-h-screen bg-[#f3f2ef] py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
            <p className="text-lg text-gray-600">
              Chargement du profil entreprise...
            </p>
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
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
            <p className="mt-3 text-gray-600">
              Aucune publication pour le moment.
            </p>
          </div>
        );

      case "Emplois":
        return (
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Emplois</h2>
            <p className="mt-3 text-gray-600">
              Les offres de l’entreprise seront affichées ici bientôt.
            </p>
          </div>
        );

      case "Personnes":
        return (
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Personnes</h2>
            <p className="mt-3 text-gray-600">
              Les membres de l’entreprise seront affichés ici bientôt.
            </p>
          </div>
        );

      default:
        return <CompanyAboutCard company={company} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 xl:grid-cols-[2.2fr_1fr]">
          <div className="space-y-4">
            <CompanyLinkedInHero company={company} />
            <CompanyLinkedInTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            {renderTabContent()}
          </div>

          <CompanyRightSidebar />
        </div>
      </div>
    </div>
  );
}