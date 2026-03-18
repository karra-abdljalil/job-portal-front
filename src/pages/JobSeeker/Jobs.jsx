import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, saveJobThunk, fetchSavedJobs, unsaveJobThunk } from "@/Redux/jobSeekerJobSlice";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase, DollarSign, Bookmark, X } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { Trash2 } from "lucide-react";

const TYPE_COLOR = {
  CDI: "indigo", CDD: "amber", Freelance: "violet", Stage: "sky", Temporaire: "rose",
};

const BADGE = {
  indigo: "bg-indigo-50 text-indigo-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  sky: "bg-sky-50 text-sky-700",
  rose: "bg-rose-50 text-rose-700",
  gray: "bg-gray-100 text-gray-600",
};

export default function JobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: jobs, loading, pagination, savedJobs = [] } = useSelector((s) => s.jobSeekerJobs);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [savedOpen, setSavedOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 400);

  const [page, setPage] = useState(1);

  const TYPES = ["", "CDI", "CDD", "Freelance", "Stage", "Temporaire"];
  const LEVELS = ["", "Junior", "Mid", "Senior"];

  useEffect(() => {
    dispatch(fetchJobs({
      search: debouncedSearch,
      location,
      employment_type: employmentType,
      experience_level: experienceLevel,
    
      page,
      limit: 12,
    }));
  }, [dispatch, debouncedSearch, location, employmentType, experienceLevel, page]);

  const handleSave = (jobId) => {
    dispatch(saveJobThunk(jobId));
  };

  const handleOpenSaved = () => {
    dispatch(fetchSavedJobs());
    setSavedOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Find Jobs</h1>
        <button
          onClick={handleOpenSaved}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 relative"
        >
          <Bookmark size={14} />
          Saved Jobs
          {savedJobs.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
              {savedJobs.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="relative min-w-[150px]">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {TYPES.map((t) => <option key={t} value={t}>{t || "All Types"}</option>)}
        </select>
        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {LEVELS.map((l) => <option key={l} value={l}>{l || "All Levels"}</option>)}
        </select>
      </div>

      {/* ── Results ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{pagination.total} jobs found</p>
        {loading && <p className="text-xs text-gray-400">Loading...</p>}
      </div>

      {/* ── Job Cards ── */}
      {jobs.length === 0 && !loading
        ? <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No jobs found.</p>
          </div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div key={job.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <button
                      onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}
                      className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors text-left leading-snug line-clamp-2 w-full"
                    >
                      {job.job_title}
                    </button>
                    <div className="flex flex-wrap gap-1">
                      {job.employment_type && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[TYPE_COLOR[job.employment_type]] || BADGE.gray}`}>
                          {job.employment_type}
                        </span>
                      )}
                      {job.experience_level && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
                          {job.experience_level}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSave(job.id)}
                    className="text-gray-300 hover:text-indigo-500 shrink-0 transition-colors"
                  >
                    <Bookmark size={16} />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-gray-500">
                  {job.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} />{job.location}
                    </div>
                  )}
                  {job.salary_range && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={12} />{job.salary_range}
                    </div>
                  )}
                </div>

                {job.Skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {job.Skills.slice(0, 3).map((skill) => (
                      <span key={skill.id} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}
                  className="mt-auto w-full py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
      }

      {/* ── Pagination ── */}
{pagination.totalPages > 1 && (
  <div className="flex items-center justify-center gap-3">
    <button
      onClick={() => setPage((p) => Math.max(1, p - 1))}
      disabled={page === 1}
      className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-xs text-gray-500">
      Page {page} of {pagination.totalPages}
    </span>
    <button
      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
      disabled={page === pagination.totalPages}
      className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

      {/* ── Saved Jobs Sidebar ── */}
      {savedOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSavedOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Bookmark size={15} className="text-indigo-600" />
                Saved Jobs ({savedJobs.length})
              </h2>
              <button onClick={() => setSavedOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {savedJobs.length === 0
                ? <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                    <Bookmark size={28} />
                    <p className="text-xs">No saved jobs yet.</p>
                  </div>
                : savedJobs.map((saved) => {
                    const job = saved.Job;
                    if (!job) return null;
                    return (
                      <div key={saved.id} className="bg-gray-50 rounded-xl p-4 space-y-2 hover:bg-indigo-50 transition-all">
  <div className="flex items-start justify-between gap-2">
    <p className="text-sm font-semibold text-gray-900 line-clamp-2">{job.job_title}</p>
    <button
      onClick={() => dispatch(unsaveJobThunk(saved.job_id))}
      className="text-gray-300 hover:text-red-500 shrink-0"
    >
      <Trash2 size={13} />
    </button>
  </div>
  {job.employment_type && (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[TYPE_COLOR[job.employment_type]] || BADGE.gray}`}>
      {job.employment_type}
    </span>
  )}
  <div className="text-xs text-gray-500 space-y-1">
    {job.location && (
      <div className="flex items-center gap-1.5">
        <MapPin size={11} />{job.location}
      </div>
    )}
    {job.salary_range && (
      <div className="flex items-center gap-1.5">
        <DollarSign size={11} />{job.salary_range}
      </div>
    )}
  </div>
  <button
    onClick={() => { navigate(`/jobseeker/jobs/${job.id}`); setSavedOpen(false); }}
    className="w-full py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
  >
    View Details
  </button>
</div>
                    );
                  })
              }
            </div>
          </div>
        </>
      )}

    </div>
  );
}