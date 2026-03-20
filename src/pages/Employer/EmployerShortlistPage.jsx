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
          fullName: app.full_name || "Candidate",
          title: app.email || "Email not provided",
          location: app.location || "Not provided",
          experienceLevel: app.status || "Shortlisted",
          skills: app.skills || [],
          cvId: app.cv_id || null,
          cvFileName: app.cv_file_name || "cv.pdf",
          lastActive: app.shortlisted_at
            ? new Date(app.shortlisted_at).toLocaleDateString("fr-FR")
            : app.application_date
            ? new Date(app.application_date).toLocaleDateString("fr-FR")
            : "Date not available",
          status:
            app.matching_score !== null && app.matching_score !== undefined
              ? `AI Score: ${app.matching_score}`
              : "Shortlisted",
          isShortlisted: true,
        }));

        setShortlistedApplicants(mappedApplicants);
      } catch (err) {
        console.error("Shortlist page error:", err);
        setError(
          err?.message ||
            "Unable to load the shortlist for this job."
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
    <div className="min-h-full bg-[#f4f2ee] py-6">
      <div className="mx-auto max-w-7xl space-y-5 px-4">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

          <div className="px-6 pb-6 pt-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                  Shortlist Management
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  Shortlist
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {job?.job_title
                    ? `Preselected candidates for: ${job.job_title}`
                    : "Preselected candidates for this job post"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/employer/jobs/${jobId}`}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Job Dashboard
                </Link>

                <Link
                  to={`/employer/jobs/${jobId}/applicants`}
                  className="rounded-full border border-[#0a66c2] px-5 py-3 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#e8f3ff]"
                >
                  View All Candidates
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10 md:max-w-md"
            />

            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
              {filteredApplicants.length} shortlisted profile(s)
            </span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Loading shortlist...</p>
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No shortlisted candidates
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Candidates added to the shortlist will appear here.
            </p>

            <Link
              to={`/employer/jobs/${jobId}/applicants`}
              className="mt-5 inline-flex rounded-2xl bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
            >
              Go to Candidates List
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
            <div className="space-y-4">
              {filteredApplicants.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>

            <aside className="space-y-5">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Shortlist Summary
                </h2>

                <div className="mt-5 space-y-4 text-sm text-slate-700">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Job Post
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {job?.job_title || "Job Post"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Shortlisted Profiles
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {shortlistedApplicants.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Filtered Result
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {filteredApplicants.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Tip
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Use this shortlist to track the most relevant candidates and
                  speed up your preselection process.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}