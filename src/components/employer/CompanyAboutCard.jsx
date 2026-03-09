import React, { useState } from "react";

export default function CompanyAboutCard({ company }) {
  const { description, industry, location } = company;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
      <div className="px-6 py-5">
        <h2 className="text-2xl font-bold text-gray-900">À propos</h2>

        <p className="mt-5 text-lg leading-8 text-gray-700">
          {description ||
            "Ajoutez une description détaillée de votre entreprise pour présenter votre activité, votre vision et vos services."}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Secteur
              </p>
              <p className="mt-1 text-lg text-gray-800">
                {industry || "Non renseigné"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Localisation
              </p>
              <p className="mt-1 text-lg text-gray-800">
                {location || "Non renseignée"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Taille de l’entreprise
              </p>
              <p className="mt-1 text-lg text-gray-800">2-10 employés</p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Fondation
              </p>
              <p className="mt-1 text-lg text-gray-800">2020</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-8 border-t border-[#e0dfdc] pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Site web
                </p>
                <p className="mt-1 text-lg text-gray-800">Non renseigné</p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Email contact
                </p>
                <p className="mt-1 text-lg text-gray-800">Non renseigné</p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Téléphone
                </p>
                <p className="mt-1 text-lg text-gray-800">Non renseigné</p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Statut
                </p>
                <p className="mt-1 text-lg text-gray-800">Entreprise active</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((prev) => !prev)}
        className="w-full border-t border-[#e0dfdc] px-6 py-4 text-center text-xl font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        {showDetails ? "Voir moins de détails" : "Voir tous les détails"}
      </button>
    </div>
  );
}