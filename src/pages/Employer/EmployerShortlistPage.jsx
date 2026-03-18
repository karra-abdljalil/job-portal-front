import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CandidateCard from "../../components/candidates/CandidateCard";
import { getEmployerJobById } from "../../services/employerJobs.service";
import { getShortlistedApplicantsByJob } from "../../services/employerShortlist.service";

export default function EmployerShortlistPage() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [search, setSearch] = useState("");
  const [shortlistedApplicants, setShortlistedApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShortlist = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobRes, shortlistRes] = await Promise.all([
  getEmployerJobById(jobId),
  getShortlistedApplicantsByJob(jobId),
]);

setJob(jobRes?.data || null);

const rawApplicants = shortlistRes?.shortlisted || [];

const mappedApplicants = rawApplicants.map((app) => ({
  id: app.application_id || app.id,
  applicationId: app.application_id || app.id,
  fullName: app.full_name || "Candidat",
  title: app.email || "Email non renseigné",
  location: app.location || "Non renseigné",
  experienceLevel: app.status || "Shortlisted",
  skills: app.skills || [],
  cvId: app.cv_id || null,
  cvFileName: app.cv_file_name || "cv.pdf",
  lastActive: app.shortlisted_at
    ? new Date(app.shortlisted_at).toLocaleDateString("fr-FR")
    : app.application_date
    ? new Date(app.application_date).toLocaleDateString("fr-FR")
    : "Date non disponible",
  status:
    app.matching_score !== null && app.matching_score !== undefined
      ? `Score IA: ${app.matching_score}`
      : "Shortlisted",
  isShortlisted: true,
}));

setShortlistedApplicants(mappedApplicants);
      } catch (err) {
        console.error("Shortlist page error:", err);
        setError(
          err?.message ||
            "Impossible de charger la shortlist pour cette offre."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShortlist();
  }, [jobId]);

  const filteredApplicants = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return shortlistedApplicants;

    return shortlistedApplicants.filter((candidate) => {
      return (
        candidate.fullName?.toLowerCase().includes(q) ||
        candidate.title?.toLowerCase().includes(q)
      );
    });
  }, [shortlistedApplicants, search]);

  return (
    <div className="min-h-full bg-[#f3f2ef]">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shortlist</h1>
              <p className="mt-1 text-sm text-gray-600">
                {job?.job_title
                  ? `Profils présélectionnés pour : ${job.job_title}`
                  : "Profils présélectionnés pour cette offre"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/employer/jobs/${jobId}`}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Retour au job dashboard
              </Link>

              <Link
                to={`/employer/jobs/${jobId}/applicants`}
                className="rounded-full border border-[#0a66c2] px-5 py-2.5 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#e8f3ff]"
              >
                Voir tous les candidats
              </Link>
            </div>
          </div>
        </div>

        {/* Search + count */}
        <div className="rounded-2xl border border-[#e0dfdc] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20 md:max-w-md"
            />

            <span className="inline-flex rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-semibold text-gray-700">
              {filteredApplicants.length} profil(s) shortlisté(s)
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Chargement de la shortlist...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Aucun profil shortlisté
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Les candidats ajoutés à la shortlist apparaîtront ici.
            </p>

            <Link
              to={`/employer/jobs/${jobId}/applicants`}
              className="mt-4 inline-flex rounded-xl bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
            >
              Aller à la liste des candidats
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[2.2fr_1fr]">
            <div className="space-y-4">
              {filteredApplicants.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900">
                  Résumé shortlist
                </h2>

                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Offre
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                      {job?.job_title || "Offre"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Profils shortlistés
                    </p>
                    <p className="mt-1">{shortlistedApplicants.length}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Résultat filtré
                    </p>
                    <p className="mt-1">{filteredApplicants.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900">Conseil</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Utilise cette shortlist pour suivre les profils les plus pertinents
                  et accélérer ta phase de présélection.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}