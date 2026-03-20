import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CandidateCard from "../../components/candidates/CandidateCard";
import { getApplicantsByJob } from "../../services/employerApplicants.service";

export default function ApplicantsPage() {
  const { jobId } = useParams();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getApplicantsByJob(jobId);

        const mappedApplicants = (res.applicants || []).map((app) => ({
          id: app.application_id,
          applicationId: app.application_id,
          fullName: app.full_name,
          title: app.email,
          location: "Not specified",
          experienceLevel: app.status,
          skills: [],
          cvId: app.cv_id,
          cvFileName: app.cv_file_name,
          lastActive: new Date(app.application_date).toLocaleDateString("fr-FR"),
          status:
            app.matching_score !== null
              ? `AI Score: ${app.matching_score}`
              : "Candidate",
          isShortlisted: app.is_shortlisted || false,
        }));

        setApplicants(mappedApplicants);
      } catch (err) {
        console.error(err);
        setError("Unable to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const filteredApplicants = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return applicants;

    return applicants.filter((app) => {
      return (
        app.fullName.toLowerCase().includes(q) ||
        app.title.toLowerCase().includes(q)
      );
    });
  }, [applicants, search]);

  return (
    <div className="min-h-screen bg-[#f4f2ee] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="h-24 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

              <div className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                      Candidate Management
                    </div>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                      Job Applicants
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                      Review candidates who applied for this job.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Job ID: {jobId}</p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {filteredApplicants.length} applicant(s)
                  </span>
                </div>

                <div className="mt-5">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
                  />
                </div>
              </div>
            </div>

            {loading && (
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-600">
                Loading applicants...
              </div>
            )}

            {error && (
              <div className="rounded-[28px] border border-red-200 bg-white p-5 shadow-sm text-sm text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && filteredApplicants.length === 0 && (
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  No applicants found
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No candidate matches your current search.
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              filteredApplicants.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
          </div>

          <aside className="hidden space-y-4 md:block">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Summary
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                This page displays all applicants who submitted an application
                for the selected job post.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Available Actions
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use candidate cards to review profiles, shortlist candidates,
                and access CV downloads when available.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}