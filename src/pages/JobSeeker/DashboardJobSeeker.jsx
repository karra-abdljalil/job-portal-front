import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "@/Redux/dashboardJobSeekerSlice";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Star, BookOpen, ArrowRight } from "lucide-react";

const STATUS_COLOR = {
  applied: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  interview: "bg-violet-100 text-violet-700",
  offer: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function DashboardJobSeeker() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const { data, loading } = useSelector((s) => s.dashboardJobSeeker);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading || !data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const applications = data.Applications || [];
  const skills = data.Skills || [];
  const experiences = data.Experiences || [];
  const cvs = data.Cvs || [];

  const stats = [
    { icon: Briefcase, label: "Applications", val: applications.length, color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: FileText, label: "CVs", val: cvs.length, color: "text-sky-600", bg: "bg-sky-50" },
    { icon: Star, label: "Skills", val: skills.length, color: "text-amber-600", bg: "bg-amber-50" },
    { icon: BookOpen, label: "Experiences", val: experiences.length, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">

      {/* ── Welcome ── */}
      <div className="bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 rounded-2xl p-6 text-white">
        <p className="text-sm opacity-80">Welcome back 👋</p>
        <h1 className="text-2xl font-bold mt-1">{data.full_name}</h1>
        <p className="text-sm opacity-70 mt-0.5">{data.email}</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, val, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{val}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Recent Applications ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Recent Applications</h2>
            <button onClick={() => navigate("/jobseeker/applications")}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          {applications.length === 0
            ? <p className="text-xs text-gray-400 italic">No applications yet.</p>
            : <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                        {app.Job?.Company?.company_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{app.Job?.job_title}</p>
                        <p className="text-xs text-gray-400 truncate">{app.Job?.Company?.company_name}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLOR[app.status] || "bg-gray-100 text-gray-600"}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* ── Skills ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">My Skills</h2>
            <button onClick={() => navigate("/jobseeker/profile")}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              Edit <ArrowRight size={12} />
            </button>
          </div>
          {skills.length === 0
            ? <p className="text-xs text-gray-400 italic">No skills added yet.</p>
            : <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
          }
        </div>

        {/* ── Recent Experience ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Work Experience</h2>
            <button onClick={() => navigate("/jobseeker/profile")}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              Edit <ArrowRight size={12} />
            </button>
          </div>
          {experiences.length === 0
            ? <p className="text-xs text-gray-400 italic">No experience added yet.</p>
            : <div className="space-y-3">
                {experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                      {exp.company_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{exp.job_title}</p>
                      <p className="text-xs text-indigo-600">{exp.company_name}</p>
                      <p className="text-xs text-gray-400">
                        {exp.start_date?.slice(0, 7)} — {exp.end_date ? exp.end_date?.slice(0, 7) : "Present"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* ── CVs ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">My CVs</h2>
            <button onClick={() => navigate("/jobseeker/resumes")}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </button>
          </div>
          {cvs.length === 0
            ? <p className="text-xs text-gray-400 italic">No CVs uploaded yet.</p>
            : <div className="space-y-2">
                {cvs.map((cv) => (
                  <div key={cv.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-indigo-500" />
                      <p className="text-xs text-gray-700 truncate max-w-[180px]">
                        {cv.file_path?.split("/").pop() || "CV"}
                      </p>
                    </div>
                    {cv.is_default && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </div>
                ))}
              </div>
          }
        </div>

      </div>
    </div>
  );
}