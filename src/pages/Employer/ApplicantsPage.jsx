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
      ? `Score IA: ${app.matching_score}`
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
    <div className="min-h-screen bg-[#f3f2ef] py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          {/* Main */}
          <div className="space-y-3">
            <div className="rounded-xl border border-[#e0dfdc] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Job Applicants
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Job ID : {jobId}
                  </p>
                </div>

                <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-semibold text-gray-700">
                  {filteredApplicants.length} applicant(s)
                </span>
              </div>

              <div className="mt-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/30"
                />
              </div>
            </div>

            {loading && (
              <div className="rounded-xl border border-[#e0dfdc] bg-white p-4 shadow-sm text-sm text-gray-600">
                Loading applicants...
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-white p-4 shadow-sm text-sm text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && filteredApplicants.length === 0 && (
              <div className="rounded-xl border border-[#e0dfdc] bg-white p-4 shadow-sm text-sm text-gray-600">
               No applicants found.
              </div>
            )}

            {!loading &&
              !error &&
              filteredApplicants.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
          </div>

          {/* Sidebar */}
          <aside className="hidden md:block space-y-3">
            <div className="rounded-xl border border-[#e0dfdc] bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">Summary</p>
              <p className="mt-2 text-sm text-gray-600">
                This page displays applicants who applied for the job.
              </p>
            </div>

            <div className="rounded-xl border border-[#e0dfdc] bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">Actions</p>
              <p className="mt-2 text-sm text-gray-600">
                Shortlist UI available, CV download enabled.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}