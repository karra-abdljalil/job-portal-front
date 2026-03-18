import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById, saveJobThunk } from "@/Redux/jobSeekerJobSlice";
import { apply } from "@/Redux/applicationSlice";
import { fetchMyCvs } from "@/Redux/cvSlice";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Briefcase, Bookmark, Send } from "lucide-react";

export default function JobDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentJob: job, loading } = useSelector((s) => s.jobSeekerJobs);
  const { items: cvs = [] } = useSelector((s) => s.cv) || {};
  const { loading: applying, error: applyError } = useSelector((s) => s.applications);

  const [applyModal, setApplyModal] = useState(false);
  const [selectedCv, setSelectedCv] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
    dispatch(fetchMyCvs());
  }, [dispatch, id]);

  const handleApply = () => {
    if (!selectedCv) return;
    dispatch(apply({ jobId: id, cvId: selectedCv })).then((res) => {
      if (!res.error) {
        setApplySuccess(true);
        setApplyModal(false);
      }
    });
  };

  if (loading || !job) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5 p-6">
      <button
        onClick={() => navigate("/jobseeker/jobs")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium"
      >
        <ArrowLeft size={15} /> Back to Jobs
      </button>

      {/* ── Header ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" />
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-gray-900">{job.job_title}</h1>
              <div className="flex flex-wrap gap-2">
                {job.employment_type && (
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    {job.employment_type}
                  </span>
                )}
                {job.experience_level && (
                  <span className="bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    {job.experience_level}
                  </span>
                )}
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.is_active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {job.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => dispatch(saveJobThunk(job.id))}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-indigo-600"
              >
                <Bookmark size={16} />
              </button>
              {applySuccess
                ? <span className="px-4 py-2 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg">
                    ✅ Applied!
                  </span>
                : <button
                    onClick={() => setApplyModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Send size={13} /> Apply Now
                  </button>
              }
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            {[
              { icon: MapPin, label: "Location", val: job.location || "Not specified" },
              { icon: DollarSign, label: "Salary", val: job.salary_range || "Not specified" },
              { icon: Briefcase, label: "Type", val: job.employment_type || "Not specified" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label}>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1"><Icon size={12} />{label}</div>
                <p className="text-sm font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">Job Description</h2>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {job.job_description || "No description provided."}
        </p>
      </div>

      {/* ── Skills ── */}
      {job.Skills?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h2 className="text-sm font-semibold text-gray-800">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.Skills.map((skill) => (
              <span key={skill.id} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Apply Modal ── */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Apply for {job.job_title}</h3>

            {applyError && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{applyError}</p>}

            <div>
              <label className="text-xs text-gray-500 block mb-1">Select your CV *</label>
              <select
                value={selectedCv}
                onChange={(e) => setSelectedCv(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">-- Select a CV --</option>
                {cvs.map((cv) => (
                  <option key={cv.cv_id} value={cv.cv_id}>
                    {cv.file_path?.split("/").pop() || "CV"} {cv.is_default ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setApplyModal(false)}
                className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!selectedCv || applying}
                className="flex-1 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {applying ? "Applying..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}