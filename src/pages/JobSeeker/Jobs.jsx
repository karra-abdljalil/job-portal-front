import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, saveJobThunk, fetchSavedJobs } from "@/Redux/jobSeekerJobSlice";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, DollarSign, Bookmark, X,
  Briefcase, ChevronDown, SlidersHorizontal,
  Building2, Clock, ArrowRight
} from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

const TYPE_COLOR = {
  CDI: "bg-blue-50 text-blue-700",
  CDD: "bg-amber-50 text-amber-700",
  Freelance: "bg-violet-50 text-violet-700",
  Stage: "bg-sky-50 text-sky-700",
  Temporaire: "bg-rose-50 text-rose-700",
};

const TYPES = ["CDI", "CDD", "Freelance", "Stage", "Temporaire"];
const LEVELS = ["Junior", "Mid", "Senior"];

export default function JobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: jobs, loading, pagination, savedJobs = [] } = useSelector((s) => s.jobSeekerJobs);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [savedOpen, setSavedOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 400);
  const [debouncedLocation] = useDebounce(location, 400);

  const savedIds = savedJobs.map((s) => s.job_id || s.Job?.id);

  useEffect(() => {
    dispatch(fetchJobs({
      search: debouncedSearch,
      location: debouncedLocation,
      employment_type: selectedTypes.length === 1 ? selectedTypes[0] : "",
      experience_level: selectedLevels.length === 1 ? selectedLevels[0] : "",
      page,
      limit: 6,
    }));
  }, [dispatch, debouncedSearch, debouncedLocation, selectedTypes, selectedLevels, page]);

  useEffect(() => { dispatch(fetchSavedJobs()); }, [dispatch]);

  const toggleType = (t) => setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const toggleLevel = (l) => setSelectedLevels((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  const clearFilters = () => { setSelectedTypes([]); setSelectedLevels([]); setLocation(""); setSearch(""); };

  const handleSave = (jobId) => {
    dispatch(saveJobThunk(jobId)).then(() => dispatch(fetchSavedJobs()));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Search Bar ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="relative flex-1 max-w-xl">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Job title, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-slate-50"
            />
          </div>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 w-44 bg-slate-50"
            />
          </div>
          <button
            onClick={() => { setSavedOpen(true); dispatch(fetchSavedJobs()); }}
            className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <Bookmark size={15} />
            Saved
            {savedJobs.length > 0 && (
              <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                {savedJobs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

        {/* ── Left Filters ── */}
        <div className="w-64 shrink-0 space-y-4">

          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-slate-600" />
              <span className="text-sm font-bold text-slate-800">Filters</span>
            </div>
            {(selectedTypes.length > 0 || selectedLevels.length > 0) && (
              <button onClick={clearFilters} className="text-xs text-blue-600 font-semibold hover:underline">
                Clear all
              </button>
            )}
          </div>

          {/* Employment Type */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Employment Type</h3>
            <div className="space-y-2">
              {TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-300"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Experience Level</h3>
            <div className="space-y-2">
              {LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level)}
                    onChange={() => toggleLevel(level)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-300"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active filters */}
          {(selectedTypes.length > 0 || selectedLevels.length > 0) && (
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-1.5">
                {[...selectedTypes, ...selectedLevels].map((f) => (
                  <span key={f} className="flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    {f}
                    <button onClick={() => TYPES.includes(f) ? toggleType(f) : toggleLevel(f)}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Jobs List ── */}
        <div className="flex-1 space-y-4">

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">{pagination.total}</span> jobs found
            </p>
            {loading && <p className="text-xs text-slate-400 animate-pulse">Loading...</p>}
          </div>

          {/* Job Cards */}
          {jobs.length === 0 && !loading
            ? <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                <Briefcase size={36} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm text-slate-400 font-medium">No jobs found</p>
                <p className="text-xs text-slate-300 mt-1">Try adjusting your filters</p>
              </div>
            : <div className="space-y-3">
                {jobs.map((job) => {
                  const isSaved = savedIds.includes(job.id);
                  return (
                    <div key={job.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Company Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
                          {job.job_title?.[0]?.toUpperCase()}
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <button
                                onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}
                                className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                              >
                                {job.job_title}
                              </button>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                                {job.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={11} /> {job.location}
                                  </span>
                                )}
                                {job.salary_range && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign size={11} /> {job.salary_range}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bookmark */}
                            <button
                              onClick={() => handleSave(job.id)}
                              className={`shrink-0 p-1.5 rounded-lg transition-all ${isSaved ? "text-blue-600 bg-blue-50" : "text-slate-300 hover:text-blue-500 hover:bg-blue-50"}`}
                            >
                              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {job.employment_type && (
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${TYPE_COLOR[job.employment_type] || "bg-slate-100 text-slate-600"}`}>
                                {job.employment_type}
                              </span>
                            )}
                            {job.experience_level && (
                              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 text-slate-600">
                                {job.experience_level}
                              </span>
                            )}
                            {job.Skills?.slice(0, 3).map((skill) => (
                              <span key={skill.id} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}
                          className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          View <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
          }

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                    page === i + 1 ? "bg-blue-600 text-white" : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Saved Jobs Sidebar ── */}
      {savedOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={() => setSavedOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Bookmark size={15} className="text-blue-600" />
                Saved Jobs
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">{savedJobs.length}</span>
              </h2>
              <button onClick={() => setSavedOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {savedJobs.length === 0
                ? <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-300">
                    <Bookmark size={32} />
                    <p className="text-xs text-slate-400">No saved jobs yet.</p>
                  </div>
                : savedJobs.map((saved) => {
                    const job = saved.Job;
                    if (!job) return null;
                    return (
                      <div key={saved.id} className="bg-slate-50 rounded-xl p-4 space-y-2 hover:bg-blue-50 transition-colors">
                        <p className="text-sm font-bold text-slate-900 line-clamp-2">{job.job_title}</p>
                        {job.employment_type && (
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_COLOR[job.employment_type] || "bg-slate-100 text-slate-600"}`}>
                            {job.employment_type}
                          </span>
                        )}
                        {job.location && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={11} /> {job.location}
                          </p>
                        )}
                        <button
                          onClick={() => { navigate(`/jobseeker/jobs/${job.id}`); setSavedOpen(false); }}
                          className="w-full py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        >
                          View Details <ArrowRight size={11} />
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