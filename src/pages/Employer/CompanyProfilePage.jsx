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
            "Impossible de charger le profil entreprise."
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Aucun profil entreprise
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Vous devez d’abord créer votre profil entreprise avant de pouvoir le consulter.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                to="/employer/company/profile/edit"
                className="rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white hover:bg-[#004182]"
              >
                Créer le profil entreprise
              </Link>

              <Link
                to="/employer/dashboard"
                className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-white"
              >
                Retour au dashboard
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

          <CompanyRightSidebar company={company} />
        </div>
      </div>
    </div>
  );
}