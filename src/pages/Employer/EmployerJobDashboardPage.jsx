import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getEmployerJobById,
  updateEmployerJobStatus,
} from "../../services/employerJobs.service";
import { getApplicantsByJob } from "../../services/employerApplicants.service";
import { getShortlistedApplicantsByJob } from "../../services/employerShortlist.service";
import { getCompanyLogo } from "../../services/companyLogo.service";

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function EmptyBlock({ title, text }) {
  return (
    <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{text}</p>
    </div>
  );
}

export default function EmployerJobDashboardPage() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    let logoObjectUrl = null;

    const fetchData = async () => {
      try {
        const [jobRes, applicantsRes, shortlistRes] = await Promise.all([
          getEmployerJobById(jobId),
          getApplicantsByJob(jobId),
          getShortlistedApplicantsByJob(jobId).catch(() => ({ applicants: [] })),
        ]);

        setJob(jobRes?.data || null);
        setApplicants(applicantsRes?.applicants || []);
        setShortlisted(
          shortlistRes?.applicants ||
            shortlistRes?.data ||
            shortlistRes?.shortlisted ||
            []
        );

        try {
          const logoBlob = await getCompanyLogo();
          logoObjectUrl = URL.createObjectURL(logoBlob);
          setCompanyLogoUrl(logoObjectUrl);
        } catch (logoErr) {
          console.error("Logo non chargé :", logoErr);
          setCompanyLogoUrl("");
        }
      } catch (err) {
        console.error("Employer job dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (logoObjectUrl) {
        URL.revokeObjectURL(logoObjectUrl);
      }
    };
  }, [jobId]);

  const recentApplicants = useMemo(() => applicants.slice(0, 5), [applicants]);

  const handleToggleStatus = async () => {
    if (!job) return;

    try {
      setStatusLoading(true);
      const res = await updateEmployerJobStatus(job.id, !job.is_active);
      setJob(res?.data || job);
    } catch (err) {
      console.error("Update status error:", err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Chargement...</p>;
  }

  if (!job) {
    return <p className="p-6">Erreur chargement</p>;
  }

  return (
    <div className="min-h-full bg-[#f3f2ef]">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* HEADER */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-[#0a66c2] to-[#70b5f9]" />

          <div className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
                  {companyLogoUrl ? (
                    <img
                      src={companyLogoUrl}
                      alt="Logo entreprise"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#0a66c2] text-lg font-bold text-white">
                      {job.company_name?.charAt(0) || "C"}
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {job.job_title}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {job.company_name || "Entreprise"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.employment_type}</span>
                    <span>•</span>
                    <span>{job.experience_level}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        job.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {job.is_active ? "Active" : "Inactive"}
                    </span>

                    <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-semibold text-gray-700">
                      {applicants.length} candidatures
                    </span>

                    <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-semibold text-gray-700">
                      {shortlisted.length} shortlist
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/employer/jobs"
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Retour
                </Link>

                <Link
                  to={`/employer/jobs/${job.id}/applicants`}
                  className="rounded-xl bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#004182]"
                >
                  Voir candidats
                </Link>

                <Link
                  to={`/employer/jobs/${job.id}/edit`}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Modifier
                </Link>

                <button
                  onClick={handleToggleStatus}
                  disabled={statusLoading}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    job.is_active
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  } ${statusLoading ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {statusLoading
                    ? "..."
                    : job.is_active
                    ? "Désactiver"
                    : "Activer"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Candidatures" value={applicants.length} />
          <InfoCard label="Shortlist" value={shortlisted.length} />
          <InfoCard
            label="Taux shortlist"
            value={
              applicants.length
                ? Math.round((shortlisted.length / applicants.length) * 100) + "%"
                : "0%"
            }
          />
          <InfoCard label="Salaire" value={job.salary_range || "—"} />
        </div>

        {/* DESCRIPTION */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-3 text-sm text-gray-700">
            {job.job_description || "Aucune description"}
          </p>

          {job.skills?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CANDIDATS */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Candidats récents</h2>

          {recentApplicants.length === 0 ? (
            <div className="mt-4">
              <EmptyBlock
                title="Aucune candidature"
                text="Les candidats apparaîtront ici"
              />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recentApplicants.map((app) => (
                <div
                  key={app.application_id}
                  className="flex justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-semibold">{app.full_name}</p>
                    <p className="text-sm text-gray-600">{app.email}</p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SHORTLIST */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Shortlist</h2>

          {shortlisted.length === 0 ? (
            <div className="mt-4">
              <EmptyBlock
                title="Aucun shortlist"
                text="Ajoutez des candidats"
              />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {shortlisted.slice(0, 5).map((app) => (
                <div
                  key={app.application_id}
                  className="rounded-xl border p-4"
                >
                  <p className="font-semibold">{app.full_name}</p>
                  <p className="text-sm text-gray-600">{app.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}