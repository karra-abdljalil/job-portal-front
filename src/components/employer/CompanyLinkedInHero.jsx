import React from "react";
import { Link } from "react-router-dom";

export default function CompanyLinkedInHero({ company }) {
  const {
    company_name,
    description,
    industry,
    location,
    logoUrl,
  } = company;

  const initial = company_name?.trim()?.charAt(0)?.toUpperCase() || "C";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
      <div className="h-36 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

      <div className="px-6 pb-6">
        <div className="-mt-12 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white text-3xl font-bold text-[#0a66c2] shadow-sm">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo entreprise"
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <div className="pt-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {company_name || "Nom entreprise"}
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                {[industry, location].filter(Boolean).join(" • ") ||
                  "Secteur et localisation non renseignés"}
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
                {description ||
                  "Ajoutez une description de votre entreprise pour mieux présenter votre activité."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/employer/company/profile/edit"
              className="rounded-full bg-[#0a66c2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004182]"
            >
              Modifier le profil
            </Link>

            <Link
              to="/employer/dashboard"
              className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}