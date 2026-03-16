import React from "react";

export default function CompanyAboutCard({ company }) {
  const { description, industry, location, company_name } = company;

  return (
    <div className="rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
      <div className="border-b border-[#e0dfdc] px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-900">À propos</h2>
      </div>

      <div className="px-6 py-5 space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Présentation
          </p>
          <p className="mt-2 text-sm leading-7 text-gray-700">
            {description ||
              "Aucune description renseignée pour le moment."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Nom de l’entreprise
            </p>
            <p className="mt-2 text-base text-gray-900">
              {company_name || "Non renseigné"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Secteur
            </p>
            <p className="mt-2 text-base text-gray-900">
              {industry || "Non renseigné"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Localisation
            </p>
            <p className="mt-2 text-base text-gray-900">
              {location || "Non renseignée"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Statut
            </p>
            <p className="mt-2 text-base text-gray-900">
              Profil entreprise actif
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}