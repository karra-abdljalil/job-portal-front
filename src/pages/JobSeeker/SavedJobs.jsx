import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedJobs } from "@/Redux/jobSeekerJobSlice";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, DollarSign, Briefcase } from "lucide-react";

export default function SavedJobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedJobs = [], loading } = useSelector((s) => s.jobSeekerJobs);

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Bookmark size={20} className="text-indigo-600" /> Saved Jobs
      </h1>

      {savedJobs.length === 0
        ? <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <Bookmark size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No saved jobs yet.</p>
          </div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((saved) => {
              const job = saved.Job;
              if (!job) return null;
              return (
                <div key={saved.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all flex flex-col gap-3"
                >
                  <div className="space-y-1">
                    <button
                      onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}
                      className="text-sm font-bold text-gray-900 hover:text-indigo-600 text-left leading-snug line-clamp-2 w-full"
                    >
                      {job.job_title}
                    </button>
                    <div className="flex flex-wrap gap-1">
                      {job.employment_type && (
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {job.employment_type}
                        </span>
                      )}
                    </div>
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

                  <button
                    onClick={() => navigate(`/jobseeker/jobs/${job.id}`)}
                    className="mt-auto w-full py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}