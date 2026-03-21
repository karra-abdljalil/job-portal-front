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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EmptyBlock({ title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
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
          console.error("Logo not loaded:", logoErr);
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
      alert("Error while updating the status");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-[#f4f2ee] px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-full bg-[#f4f2ee] px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-red-600">Loading error</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f4f2ee] px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* HEADER */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

          <div className="px-6 pb-6">
            <div className="-mt-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg">
                  {companyLogoUrl ? (
                    <img
                      src={companyLogoUrl}
                      alt="Company logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#0a66c2] text-xl font-bold text-white">
                      {job.company_name?.charAt(0) || "C"}
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                    Job Dashboard
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {job.job_title}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {job.company_name || "Company"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {job.location || "Location not specified"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {job.employment_type || "Type not specified"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {job.experience_level || "Experience not specified"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        job.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {job.is_active ? "Active" : "Inactive"}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {applicants.length} applications
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {shortlisted.length} shortlisted
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/employer/jobs"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </Link>

                <Link
                  to={`/employer/jobs/${job.id}/applicants`}
                  className="rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
                >
                  View Candidates
                </Link>

                <Link
                  to={`/employer/jobs/${job.id}/edit`}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Edit
                </Link>

                <button
                  onClick={handleToggleStatus}
                  disabled={statusLoading}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    job.is_active
                      ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  } ${statusLoading ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {statusLoading
                    ? "Updating..."
                    : job.is_active
                    ? "Deactivate"
                    : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Applications" value={applicants.length} />
          <InfoCard label="Shortlist" value={shortlisted.length} />
          <InfoCard
            label="Shortlist Rate"
            value={
              applicants.length
                ? Math.round((shortlisted.length / applicants.length) * 100) + "%"
                : "0%"
            }
          />
          <InfoCard label="Salary" value={job.salary_range || "—"} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-5">
            {/* DESCRIPTION */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Job Description
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Overview of the role, requirements, and expected skills
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                {job.job_description || "No description available"}
              </p>

              {job.skills?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#eef3f8] px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* RECENT APPLICANTS */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recent Candidates
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Latest applicants for this job post
                  </p>
                </div>
              </div>

              {recentApplicants.length === 0 ? (
                <div className="mt-5">
                  <EmptyBlock
                    title="No applications yet"
                    text="Candidates will appear here once applications are received."
                  />
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {recentApplicants.map((app) => (
                    <div
                      key={app.application_id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {app.full_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{app.email}</p>
                      </div>

                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            {/* SHORTLIST */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Shortlist
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Top candidates selected for this role
              </p>

              {shortlisted.length === 0 ? (
                <div className="mt-5">
                  <EmptyBlock
                    title="No shortlisted candidates"
                    text="Add candidates to your shortlist to see them here."
                  />
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {shortlisted.slice(0, 5).map((app) => (
                    <div
                      key={app.application_id}
                      className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
                    >
                      <p className="font-semibold text-slate-900">
                        {app.full_name}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{app.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* JOB SUMMARY */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Job Summary
              </h2>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Company
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {job.company_name || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Status
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {job.is_active ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Employment Type
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {job.employment_type || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Experience Level
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {job.experience_level || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Salary Range
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {job.salary_range || "—"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}