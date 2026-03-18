import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyApplications } from "../../Redux/applicationSlice";
import useDebounce from "../../hooks/useDebounce";
import { Briefcase, MapPin, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "../../components/StatusBadge/statusBadge";
import { formatDate } from "../../constants/function";

const STATUS_COLOR = {
  applied: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  interview: "bg-violet-50 text-violet-700",
  offer: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export default function MyApplicationsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: applications, loading, error, pagination, counts } = useSelector((state) => state.applications);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [debouncedSearch, cancelDebounce] = useDebounce(search.trim(), 500);

  useEffect(() => {
    if (debouncedSearch.length < 3 && debouncedSearch !== "") return;
    dispatch(fetchMyApplications({ search: debouncedSearch, page, limit }));
    return () => cancelDebounce();
  }, [dispatch, debouncedSearch, page]);

  const stats = [
    { label: "Total", value: counts.total_app, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Rejected", value: counts.rejected_app, color: "text-red-600", bg: "bg-red-50" },
    { label: "Interviews", value: counts.interview_app, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Reviewed", value: counts.underReview_app, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
          <p className="text-sm text-gray-400">{counts.total_app} applications total</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64"
          />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
              <Briefcase size={16} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Applications List ── */}
      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

        {!loading && applications.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No applications found.</p>
          </div>
        )}

        {!loading && applications.map((app) => (
          <div key={app.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="flex items-start justify-between gap-4 flex-wrap">

              {/* Company Logo + Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border bg-gray-50 flex items-center justify-center shrink-0">
                  {app.Job?.Company?.logo
                    ? <img src={`http://localhost:5000/uploaded_files/companies_logo/${app.Job.Company.logo}`} alt="logo" className="w-full h-full object-cover" />
                    : <Briefcase size={20} className="text-gray-400" />
                  }
                </div>
                <div className="space-y-1">
                  {/* ← clique pour voir le détail du job */}
                  <button
                    onClick={() => navigate(`/jobseeker/jobs/${app.Job?.id}`)}
                    className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors text-left"
                  >
                    {app.Job?.job_title}
                  </button>
                  <p className="text-xs text-gray-500 font-medium">{app.Job?.Company?.company_name}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    {app.Job?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />{app.Job.location}
                      </span>
                    )}
                    {app.Job?.employment_type && (
                      <span className="flex items-center gap-1">
                        <Briefcase size={11} />{app.Job.employment_type}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={11} />Applied {formatDate(app.application_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={app.status} />
                <button
                  onClick={() => navigate(`/jobseeker/jobs/${app.Job?.id}`)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  View Job →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ── */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="flex items-center gap-1 px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}