import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteEmployerJob,
  getEmployerJobs,
  updateEmployerJobStatus,
} from "../../services/employerJobs.service";

function JobCard({
  job,
  onToggleStatus,
  onDelete,
  statusLoadingId,
  deleteLoadingId,
}) {
  const isStatusLoading = statusLoadingId === job.id;
  const isDeleteLoading = deleteLoadingId === job.id;

  return (
    <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {job.job_title}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                job.is_active
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {job.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {[job.location, job.employment_type, job.experience_level]
              .filter(Boolean)
              .join(" • ") || "Informations non renseignées"}
          </p>

          {job.salary_range ? (
            <p className="mt-1 text-sm text-gray-700">
              Salaire : <span className="font-medium">{job.salary_range}</span>
            </p>
          ) : null}

          <p className="mt-2 text-xs text-gray-500">
  Publiée le{" "}
  {job.created_at
    ? new Date(job.created_at).toLocaleDateString("fr-FR")
    : "Date non disponible"}
</p>

<div className="mt-3 flex flex-wrap gap-2">
  <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-gray-700">
    {job.unique_views_count ?? 0} vue(s) unique(s)
  </span>
  <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-gray-700">
    {job.applications_count ?? 0} candidature(s)
  </span>
  <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-gray-700">
    {job.shortlisted_count ?? 0} shortlisté(s)
  </span>
</div>

          {job.skills?.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Link
            to={`/employer/jobs/${job.id}`}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Voir détails
          </Link>

          <Link
            to={`/employer/jobs/${job.id}/applicants`}
            className="rounded-full border border-[#0a66c2] px-4 py-2 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#e8f3ff]"
          >
            Voir candidats
          </Link>

          <Link
            to={`/employer/jobs/${job.id}/edit`}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Modifier
          </Link>

          <button
            type="button"
            onClick={() => onToggleStatus(job)}
            disabled={isStatusLoading}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              job.is_active
                ? "border border-orange-300 text-orange-700 hover:bg-orange-50"
                : "border border-green-300 text-green-700 hover:bg-green-50"
            } ${isStatusLoading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {isStatusLoading
              ? "Chargement..."
              : job.is_active
              ? "Désactiver"
              : "Activer"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(job)}
            disabled={isDeleteLoading}
            className={`rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 ${
              isDeleteLoading ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {isDeleteLoading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getEmployerJobs();
        setJobs(res?.data || []);
      } catch (err) {
        console.error("Get employer jobs error:", err);
        setError(
  err?.response?.data?.message ||
    err?.message ||
    "Impossible de charger les offres de l’entreprise."
);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((job) => {
        const title = job.job_title?.toLowerCase() || "";
        const location = job.location?.toLowerCase() || "";
        const employmentType = job.employment_type?.toLowerCase() || "";
        return (
          title.includes(q) ||
          location.includes(q) ||
          employmentType.includes(q)
        );
      });
    }

    if (statusFilter === "active") {
      result = result.filter((job) => job.is_active === true);
    }

    if (statusFilter === "inactive") {
      result = result.filter((job) => job.is_active === false);
    }

    return result;
  }, [jobs, search, statusFilter]);

  const handleToggleStatus = async (job) => {
    try {
      setStatusLoadingId(job.id);

      const res = await updateEmployerJobStatus(job.id, !job.is_active);
      const updatedJob = res?.data;

      setJobs((prev) =>
        prev.map((item) => (item.id === job.id ? updatedJob : item))
      );
    } catch (err) {
      console.error("Update job status error:", err);
      alert(
  err?.response?.data?.message ||
    "Impossible de mettre à jour le statut du job."
);
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l’offre "${job.job_title}" ?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(job.id);

      await deleteEmployerJob(job.id);

      setJobs((prev) => prev.filter((item) => item.id !== job.id));
    } catch (err) {
      console.error("Delete job error:", err);
      alert(
  err?.response?.data?.message ||
    "Impossible de supprimer le job."
);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="min-h-full bg-[#f3f2ef]">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes offres</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gérez toutes les offres publiées par votre entreprise.
              </p>
            </div>

            <Link
              to="/employer/jobs/create"
              className="inline-flex rounded-full bg-[#0a66c2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004182]"
            >
              Créer une offre
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-[#e0dfdc] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              placeholder="Rechercher par titre, localisation ou type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20 md:flex-1"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
            >
              <option value="all">Toutes les offres</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Chargement des offres...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-[#e0dfdc] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Aucune offre trouvée
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {jobs.length === 0
                ? "Votre entreprise n’a pas encore publié d’offre."
                : "Aucune offre ne correspond à votre recherche ou au filtre sélectionné."}
            </p>

            {jobs.length === 0 ? (
              <Link
                to="/employer/jobs/create"
                className="mt-4 inline-flex rounded-xl bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
              >
                Publier votre première offre
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                statusLoadingId={statusLoadingId}
                deleteLoadingId={deleteLoadingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}