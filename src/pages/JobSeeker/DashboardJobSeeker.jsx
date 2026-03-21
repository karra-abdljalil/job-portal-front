import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "@/Redux/dashboardJobSeekerSlice";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, FileText, Star, BookOpen, ArrowRight,
  Building2, Calendar, TrendingUp, CheckCircle2,
  Clock, XCircle, MessageSquare, Award
} from "lucide-react";

const STATUS_CONFIG = {
  applied:      { label: "Applied",      color: "bg-blue-50 text-blue-700",    dot: "bg-blue-500" },
  under_review: { label: "Under Review", color: "bg-amber-50 text-amber-700",  dot: "bg-amber-500" },
  interview:    { label: "Interview",    color: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  offer:        { label: "Offer",        color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  rejected:     { label: "Rejected",     color: "bg-red-50 text-red-600",      dot: "bg-red-500" },
};

export default function DashboardJobSeeker() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading } = useSelector((s) => s.dashboardJobSeeker);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (loading || !data) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  const applications = data.Applications || [];
  const skills = data.Skills || [];
  const experiences = data.Experiences || [];
  const cvs = data.Cvs || [];

  // Stats calculations
  const statsData = [
    {
      icon: Briefcase,
      label: "Applications",
      val: applications.length,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      onClick: () => navigate("/jobseeker/applications")
    },
    {
      icon: FileText,
      label: "CVs",
      val: cvs.length,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-100",
      onClick: () => navigate("/jobseeker/resumes")
    },
    {
      icon: Star,
      label: "Skills",
      val: skills.length,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      onClick: () => navigate("/jobseeker/profile")
    },
    {
      icon: BookOpen,
      label: "Experiences",
      val: experiences.length,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      onClick: () => navigate("/jobseeker/profile")
    },
  ];

  const offerCount = applications.filter((a) => a.status === "offer").length;
  const interviewCount = applications.filter((a) => a.status === "interview").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* ── Welcome Banner ── */}
        <div className="relative bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl p-6 text-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 right-20 w-24 h-24 bg-white/10 rounded-full" />

          <div className="relative">
            <p className="text-sm text-blue-100 font-medium">Welcome back </p>
            <h1 className="text-2xl font-bold mt-1">{data.full_name}</h1>
            <p className="text-sm text-blue-200 mt-0.5">{data.email}</p>

            {/* Quick highlights */}
            {(offerCount > 0 || interviewCount > 0) && (
              <div className="flex gap-3 mt-4">
                {offerCount > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-semibold">
                    <Award size={13} /> {offerCount} Offer{offerCount > 1 ? "s" : ""}
                  </div>
                )}
                {interviewCount > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-semibold">
                    <MessageSquare size={13} /> {interviewCount} Interview{interviewCount > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statsData.map(({ icon: Icon, label, val, color, bg, border, onClick }) => (
            <button key={label} onClick={onClick}
              className={`bg-white rounded-2xl border ${border} shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-all text-left group`}>
              <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{val}</p>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Recent Applications (2 cols) ── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Briefcase size={14} className="text-blue-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">Recent Applications</h2>
              </div>
              <button onClick={() => navigate("/jobseeker/applications")}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </button>
            </div>

            {applications.length === 0
              ? <div className="text-center py-10">
                  <Briefcase size={28} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-xs text-slate-400">No applications yet.</p>
                  <button onClick={() => navigate("/jobseeker/jobs")}
                    className="mt-2 text-xs text-blue-600 font-semibold hover:underline">
                    Browse jobs →
                  </button>
                </div>
              : <div className="space-y-2">
                  {applications.slice(0, 5).map((app) => {
                    const status = STATUS_CONFIG[app.status] || { label: app.status, color: "bg-slate-100 text-slate-600", dot: "bg-slate-400" };
                    return (
                      <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                          {app.Job?.Company?.company_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{app.Job?.job_title}</p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                            <Building2 size={10} /> {app.Job?.Company?.company_name || "Company"}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 flex items-center gap-1.5 ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
            }
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-5">

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Star size={14} className="text-amber-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">My Skills</h2>
                </div>
                <button onClick={() => navigate("/jobseeker/profile")}
                  className="text-xs text-blue-600 font-semibold hover:underline">
                  Edit
                </button>
              </div>
              {skills.length === 0
                ? <p className="text-xs text-slate-400 italic">No skills added yet.</p>
                : <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {skill.name}
                      </span>
                    ))}
                  </div>
              }
            </div>

            {/* CVs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center">
                    <FileText size={14} className="text-sky-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">My CVs</h2>
                </div>
                <button onClick={() => navigate("/jobseeker/resumes")}
                  className="text-xs text-blue-600 font-semibold hover:underline">
                  Manage
                </button>
              </div>
              {cvs.length === 0
                ? <p className="text-xs text-slate-400 italic">No CVs uploaded yet.</p>
                : <div className="space-y-2">
                    {cvs.map((cv) => (
                      <div key={cv.cv_id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={13} className="text-sky-500 shrink-0" />
                          <p className="text-xs text-slate-700 truncate">
                            {cv.file_path?.split("/").pop() || "CV"}
                          </p>
                        </div>
                        {cv.is_default && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold shrink-0">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
              }
            </div>

          </div>
        </div>

        {/* ── Experience ── */}
        {experiences.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <BookOpen size={14} className="text-emerald-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">Work Experience</h2>
              </div>
              <button onClick={() => navigate("/jobseeker/profile")}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                Edit <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {experiences.slice(0, 3).map((exp) => (
                <div key={exp.id} className="flex gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                    {exp.company_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{exp.job_title}</p>
                    <p className="text-xs text-emerald-600 font-semibold truncate">{exp.company_name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={9} />
                      {exp.start_date?.slice(0, 7)} — {exp.end_date ? exp.end_date?.slice(0, 7) : "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}