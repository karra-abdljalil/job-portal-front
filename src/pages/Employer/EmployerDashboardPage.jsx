import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployerDashboard } from "../../services/employerDashboard.service";
import { getCompanyLogo } from "../../services/companyLogo.service";

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
    </div>
  );
}

function EmptyState({ title, text, actionLabel, actionTo }) {
  return (
    <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>

      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-4 inline-flex rounded-xl bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function formatApplicationStatus(status) {
  switch (status) {
    case "applied":
      return "Candidature envoyée";
    case "reviewing":
      return "En cours d’analyse";
    case "accepted":
      return "Acceptée";
    case "rejected":
      return "Refusée";
    default:
      return status || "Statut inconnu";
  }
}

export default function EmployerDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl = null;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        setCompanyLogoUrl("");

        const res = await getEmployerDashboard();
        const dashboardData = res?.data || null;
        setDashboard(dashboardData);

        if (dashboardData?.company?.id) {
          try {
            const blob = await getCompanyLogo();
            objectUrl = URL.createObjectURL(blob);
            setCompanyLogoUrl(objectUrl);
          } catch (logoErr) {
            console.warn("Logo not found or cannot be loaded:", logoErr);
            setCompanyLogoUrl("");
          }
        }
      } catch (err) {
        console.error("Employer dashboard error:", err);
        setError(err?.message || "Impossible de charger le dashboard employeur.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  const employer = dashboard?.employer;
  const company = dashboard?.company;
  const stats = dashboard?.stats;
  const recentJobs = useMemo(() => dashboard?.recent_jobs || [], [dashboard]);
  const recentApplications = useMemo(
    () => dashboard?.recent_applications || [],
    [dashboard]
  );

  const hasCompanyProfile = !!company?.id;

  const companyInitial =
    company?.company_name?.trim()?.charAt(0)?.toUpperCase() || "C";

  const dashboardMessage = !hasCompanyProfile
    ? "Complétez votre profil entreprise pour commencer à publier et gérer vos offres."
    : stats?.total_jobs === 0
    ? "Votre profil entreprise est prêt. Publiez maintenant votre première offre."
    : stats?.total_applications === 0
    ? "Vos offres sont publiées. Les candidatures apparaîtront ici dès réception."
    : `Vous avez reçu ${stats?.total_applications} candidature(s), dont ${stats?.shortlisted_applications} en shortlist.`;

  if (loading) {
    return (
      <div className="min-h-full bg-[#f3f2ef]">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
            <p className="text-gray-600">Chargement du dashboard employeur...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-[#f3f2ef]">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f3f2ef]">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="overflow-hidden rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

          <div className="px-6 pb-6">
            <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white text-2xl font-bold text-[#0a66c2] shadow-sm">
                  {companyLogoUrl ? (
                    <img
                      src={companyLogoUrl}
                      alt="Logo entreprise"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    companyInitial
                  )}
                </div>

                <div className="pt-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Bienvenue dans votre espace {employer?.full_name || "Employer"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {company?.company_name || "Aucune entreprise configurée"}
                  </p>
                  <p className="text-sm text-gray-500">{employer?.email}</p>
                  <p className="mt-2 text-sm text-gray-600">{dashboardMessage}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!hasCompanyProfile ? (
                  <Link
                    to="/employer/company/profile/edit"
                    className="rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#004182]"
                  >
                    Créer le profil entreprise
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/employer/company/profile/edit"
                      className="rounded-full border border-[#0a66c2] px-4 py-2 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#e8f3ff]"
                    >
                      Modifier l’entreprise
                    </Link>

                    <Link
                      to="/employer/jobs/create"
                      className="rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#004182]"
                    >
                      Créer une offre
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[2.2fr_1fr]">
          <div className="space-y-4">
            {!hasCompanyProfile ? (
              <EmptyState
                title="Commencez par votre entreprise"
                text="Une fois votre profil entreprise créé, vous pourrez publier des offres, recevoir des candidatures et gérer vos shortlists."
                actionLabel="Créer le profil entreprise"
                actionTo="/employer/company/profile/edit"
              />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Total offres"
                    value={stats?.total_jobs ?? 0}
                    subtitle="Toutes vos offres publiées"
                  />
                  <StatCard
                    title="Offres actives"
                    value={stats?.active_jobs ?? 0}
                    subtitle="Offres actuellement ouvertes"
                  />
                  <StatCard
                    title="Candidatures"
                    value={stats?.total_applications ?? 0}
                    subtitle="Toutes les candidatures reçues"
                  />
                  <StatCard
                    title="Shortlist"
                    value={stats?.shortlisted_applications ?? 0}
                    subtitle="Profils présélectionnés"
                  />
                </div>

                <div className="rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
                  <div className="border-b border-[#e0dfdc] px-5 py-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Offres récentes
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Les dernières offres publiées par votre entreprise
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    {recentJobs.length === 0 ? (
                      <EmptyState
                        title="Aucune offre publiée"
                        text="Votre entreprise n’a pas encore publié d’offre. Commencez par créer votre première opportunité."
                        actionLabel="Créer une offre"
                        actionTo="/employer/jobs/create"
                      />
                    ) : (
                      <div className="space-y-3">
                        {recentJobs.map((job) => (
                          <div
                            key={job.id}
                            className="rounded-xl border border-[#e0dfdc] p-4 transition hover:bg-[#fafafa]"
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                  {job.job_title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                  {job.location || "Localisation non renseignée"} •{" "}
                                  {job.employment_type || "Type non renseigné"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Publiée le{" "}
                                  {new Date(job.created_at).toLocaleDateString("fr-FR")}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    job.is_active
                                      ? "bg-green-50 text-green-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {job.is_active ? "Active" : "Inactive"}
                                </span>

                                <Link
                                  to={`/employer/jobs/${job.id}/applicants`}
                                  className="rounded-full border border-[#0a66c2] px-4 py-2 text-sm font-semibold text-[#0a66c2] hover:bg-[#e8f3ff]"
                                >
                                  Voir candidats
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
                  <div className="border-b border-[#e0dfdc] px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Candidatures récentes
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Les dernières candidatures reçues sur vos offres
                    </p>
                  </div>

                  <div className="p-4">
                    {recentApplications.length === 0 ? (
                      <EmptyState
                        title="Aucune candidature récente"
                        text="Les candidatures reçues sur vos offres apparaîtront ici."
                      />
                    ) : (
                      <div className="space-y-3">
                        {recentApplications.map((application) => (
                          <div
                            key={application.id}
                            className="rounded-xl border border-[#e0dfdc] p-4 transition hover:bg-[#fafafa]"
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                  {application.User?.full_name || "Candidat"}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                  {application.User?.email || "Email non renseigné"}
                                </p>
                                <p className="mt-1 text-sm text-gray-700">
                                  Offre :{" "}
                                  <span className="font-medium">
                                    {application.Job?.job_title || "Offre"}
                                  </span>
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Candidature du{" "}
                                  {new Date(
                                    application.application_date
                                  ).toLocaleDateString("fr-FR")}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-semibold text-gray-700">
                                  {formatApplicationStatus(application.status)}
                                </span>

                                {application.is_shortlisted ? (
                                  <span className="rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                                    Shortlisted
                                  </span>
                                ) : null}

                                <Link
                                  to={`/employer/jobs/${application.job_id}/applicants`}
                                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                  Ouvrir la liste
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {hasCompanyProfile ? (
            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900">
                  Résumé entreprise
                </h2>

                <div className="mt-4 space-y-3 text-sm text-gray-700">
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
                      Contact
                    </p>
                    <p className="mt-1">{employer?.email || "Non renseigné"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Offres actives
                    </p>
                    <p className="mt-1">{stats?.active_jobs ?? 0}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Candidatures
                    </p>
                    <p className="mt-1">{stats?.total_applications ?? 0}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Shortlist
                    </p>
                    <p className="mt-1">{stats?.shortlisted_applications ?? 0}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900">Conseil</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Un bon parcours employeur commence par un profil entreprise clair,
                  des offres bien rédigées et une gestion rapide des candidatures.
                </p>
              </div>
            </aside>
          ) : (
            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900">Conseil</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Commencez par créer votre profil entreprise. Vous pourrez ensuite
                  publier des offres et gérer votre activité de recrutement.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}