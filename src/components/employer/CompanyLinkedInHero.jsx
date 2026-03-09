import React, { useState } from "react";
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
  const [openMenu, setOpenMenu] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Lien du profil copié avec succès.");
    } catch (error) {
      alert("Impossible de copier le lien.");
    } finally {
      setOpenMenu(false);
    }
  };

  const handleShare = () => {
    alert("Fonctionnalité de partage bientôt disponible.");
    setOpenMenu(false);
  };

  const handleNotifications = () => {
    alert("Notifications entreprise bientôt disponibles.");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
      <div className="relative h-44 w-full bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_25%)]" />
      </div>

      <div className="relative px-6 pb-6">
        <div className="-mt-16 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#0a66c2] text-4xl font-bold text-white shadow-md">
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

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {company_name || "Nom entreprise"}
            </h1>

            <p className="mt-2 text-lg text-gray-600">
              {[industry, location].filter(Boolean).join(" · ") ||
                "Secteur · Localisation"}
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-700">
              {description ||
                "Ajoutez une description de votre entreprise pour la rendre plus attractive."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/employer/company/profile/edit"
                className="rounded-full bg-[#0a66c2] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#004182]"
              >
                Modifier le profil
              </Link>

              <button
                type="button"
                className="rounded-full border border-[#0a66c2] px-6 py-3 text-base font-semibold text-[#0a66c2] transition hover:bg-[#e8f3ff]"
              >
                Voir les offres d’emploi
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu((prev) => !prev)}
                  className="rounded-full border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Plus
                </button>

                {openMenu && (
                  <div className="absolute left-0 z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="block w-full rounded-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Copier le lien du profil
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="block w-full rounded-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Partager
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex">
            <button
              type="button"
              onClick={handleNotifications}
              className="rounded-full p-3 text-gray-500 transition hover:bg-gray-100"
              title="Notifications"
            >
              🔔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}