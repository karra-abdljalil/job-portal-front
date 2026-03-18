import React from "react";
import { Link } from "react-router-dom";

export default function CompanyRightSidebar({ company }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">
          Résumé entreprise
        </h3>

        <div className="mt-4 space-y-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Entreprise
            </p>
            <p className="mt-1 font-medium text-gray-900">
              {company?.company_name || "Non renseignée"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Secteur
            </p>
            <p className="mt-1 text-gray-700">
              {company?.industry || "Non renseigné"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Localisation
            </p>
            <p className="mt-1 text-gray-700">
              {company?.location || "Non renseignée"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">
          Actions rapides
        </h3>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            to="/employer/company/profile/edit"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Modifier l’entreprise
          </Link>

          <Link
            to="/employer/dashboard"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Conseil</h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Un profil entreprise clair améliore la confiance des candidats et rend vos offres plus attractives.
        </p>
      </div>
    </aside>
  );
}