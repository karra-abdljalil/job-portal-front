import { PublicHeader } from "@/components/common/Headers/PublicHeader";
import { ButtonRedirect } from "@/components/common/Ui/ButtonRedirect";
import { useState } from "react";
import {
  Search, MapPin, Briefcase, ArrowRight, Building2,
  Zap, TrendingUp, FileText, Bell, Users, Shield,
  CheckCircle, Star, Upload, ClipboardList, UserCheck,
  ChevronRight
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────
const STATS = [
  { val: "10K+", label: "Jobs Posted" },
  { val: "50K+", label: "Job Seekers" },
  { val: "2K+", label: "Companies" },
  { val: "95%", label: "Match Rate" },
];

const JOBS = [
  { title: "Senior Frontend Developer", company: "TechCorp", location: "Casablanca", type: "CDI", match: "98%" },
  { title: "Product Designer", company: "DesignHub", location: "Rabat", type: "CDI", match: "92%" },
  { title: "Backend Engineer", company: "DataFlow", location: "Remote", type: "Freelance", match: "87%" },
];

const JOBSEEKER_FEATURES = [
  {
    icon: FileText,
    title: "Smart Profile",
    desc: "Build a professional profile with your skills, experience, education and certifications in minutes.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Upload,
    title: "CV Management",
    desc: "Upload multiple CVs, set a default and attach the right one when applying to each job.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: Search,
    title: "Advanced Search",
    desc: "Filter jobs by type, experience level, location and salary to find exactly what you're looking for.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: ClipboardList,
    title: "Application Tracking",
    desc: "Follow every application in real-time — Applied, Under Review, Interview, Offer or Rejected.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Star,
    title: "Save Jobs",
    desc: "Bookmark interesting jobs and come back to them whenever you're ready to apply.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Bell,
    title: "Stay Informed",
    desc: "Get notified when employers update the status of your applications.",
    color: "bg-rose-50 text-rose-600",
  },
];

const EMPLOYER_FEATURES = [
  {
    icon: Briefcase,
    title: "Post Jobs Easily",
    desc: "Create detailed job postings with employment type, experience level, salary and required skills.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "Manage Candidates",
    desc: "View all applicants for each position, browse their profiles and download their CVs.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: UserCheck,
    title: "Shortlist Talent",
    desc: "Add promising candidates to your shortlist and keep track of the best profiles.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Track Performance",
    desc: "Monitor your job postings — views, applications and status from a single dashboard.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Shield,
    title: "Company Profile",
    desc: "Build a credible company profile with your logo, description and sector to attract top talent.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    desc: "Pause, reactivate or delete job postings anytime with full control over your listings.",
    color: "bg-sky-50 text-sky-600",
  },
];

const HOW_IT_WORKS_SEEKER = [
  { step: "01", title: "Create your profile", desc: "Sign up and build your professional profile with skills, experience and education." },
  { step: "02", title: "Upload your CV", desc: "Add one or multiple CVs to your account and choose which to use per application." },
  { step: "03", title: "Browse & apply", desc: "Search jobs with smart filters and apply with one click using your saved CV." },
  { step: "04", title: "Track & get hired", desc: "Follow your applications in real-time until you land your dream job." },
];

const HOW_IT_WORKS_EMPLOYER = [
  { step: "01", title: "Create your company", desc: "Register and set up your company profile to attract the best candidates." },
  { step: "02", title: "Post a job", desc: "Create a detailed job posting with all the requirements and conditions." },
  { step: "03", title: "Review applications", desc: "Browse candidates, read their profiles and download their CVs." },
  { step: "04", title: "Hire the best", desc: "Shortlist top candidates and move them through your hiring pipeline." },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export const Publicpage = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [activeTab, setActiveTab] = useState("seeker");

  return (
    <div className="min-h-screen bg-white font-sans">
      <PublicHeader />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Smart Job Platform
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Find Your{" "}
              <span className="text-blue-600 relative">
                Dream Job
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 4 100 2 150 4C200 6 250 8 298 6" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <br />with Confidence
            </h1>

            <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Connect with top companies and discover opportunities that match your skills and ambitions. Your next career move starts here.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-2 flex items-center gap-2 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title or keyword..."
                  className="flex-1 text-sm outline-none text-slate-700 placeholder-slate-400"
                />
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="flex items-center gap-2 px-3">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location..."
                  className="w-32 text-sm outline-none text-slate-700 placeholder-slate-400"
                />
              </div>
              <ButtonRedirect
                link="/register?role=job_seeker"
                buttonName="Search Jobs"
                style="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shrink-0"
              />
            </div>

            <p className="text-xs text-slate-400">
              Popular:{" "}
              {["React Developer", "UI/UX Designer", "Data Analyst", "Backend Engineer"].map((tag, i) => (
                <span key={tag}>
                  <button className="text-blue-500 hover:underline font-medium">{tag}</button>
                  {i < 3 && <span className="mx-1">·</span>}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">{val}</p>
              <p className="text-sm text-slate-400 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>
{/* ── Featured Jobs ── */}
<section className="py-20 px-6 bg-slate-50">
  <div className="max-w-6xl mx-auto">
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Latest Opportunities</p>
        <h2 className="text-3xl font-extrabold text-slate-900">Featured Jobs</h2>
      </div>
      <ButtonRedirect
        link="/login"
        buttonName="View All Jobs →"
        style="text-sm font-semibold text-blue-600 hover:underline bg-transparent"
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {JOBS.map((job) => (
        <div key={job.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg">
              {job.company[0]}
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {job.match} Match
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">{job.title}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
            <Building2 size={11} /> {job.company}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{job.type}</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin size={10} /> {job.location}
            </span>
          </div>
          {/* ← remplace button par ButtonRedirect vers /login */}
          <ButtonRedirect
            link="/login"
            buttonName="Apply Now"
            style="mt-4 w-full py-2 text-xs font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
          />
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Platform Features</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Everything you need to succeed</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
              Whether you're looking for a job or hiring talent, our platform has the right tools for you.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab("seeker")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "seeker"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveTab("employer")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "employer"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              For Employers
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(activeTab === "seeker" ? JOBSEEKER_FEATURES : EMPLOYER_FEATURES).map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-slate-50 rounded-2xl p-6 space-y-3 hover:shadow-md hover:bg-white border border-transparent hover:border-slate-100 transition-all group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Simple Process</p>
            <h2 className="text-3xl font-extrabold text-slate-900">How it works</h2>
            <p className="text-slate-500 text-sm mt-2">Get started in minutes with our simple 4-step process</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab("seeker")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "seeker"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              As a Job Seeker
            </button>
            <button
              onClick={() => setActiveTab("employer")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "employer"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              As an Employer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(activeTab === "seeker" ? HOW_IT_WORKS_SEEKER : HOW_IT_WORKS_EMPLOYER).map((item, idx) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-blue-100 z-0" style={{ width: "calc(100% - 2rem)" }} />
                )}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Employers Banner ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">For Employers</p>
              <h2 className="text-2xl font-extrabold text-white">Find the perfect candidate faster</h2>
              <p className="text-slate-400 text-sm max-w-md">
                Post jobs, manage applications and build your team with our powerful employer tools. Start hiring today.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                {["Post unlimited jobs", "Browse candidate CVs", "Manage shortlists"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <CheckCircle size={12} className="text-emerald-400" /> {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <ButtonRedirect
                link="/register?role=employer"
                buttonName="Start Hiring →"
                style="px-6 py-3 text-sm font-bold text-slate-900 bg-white hover:bg-blue-50 rounded-xl shadow-md transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-sky-500">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-3xl font-extrabold text-white">Ready to find your next opportunity?</h2>
          <p className="text-blue-100 text-sm max-w-lg mx-auto">
            Join thousands of professionals who have already found their dream jobs through our platform.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <ButtonRedirect
              link="/register?role=job_seeker"
              buttonName="Get Started Free"
              style="px-6 py-3 text-sm font-bold text-blue-600 bg-white hover:bg-blue-50 rounded-xl shadow-md transition-all"
            />
            <ButtonRedirect
              link="/register?role=employer"
              buttonName="Post a Job"
              style="px-6 py-3 text-sm font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 bg-slate-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">Job<span className="text-blue-400">Portal</span></span>
        </div>
        <p className="text-xs text-slate-500">© 2026 JobPortal. All rights reserved.</p>
      </footer>

    </div>
  );
};