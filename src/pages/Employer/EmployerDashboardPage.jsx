import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployerDashboard } from "../../services/employerDashboard.service";
import { getCompanyLogo } from "../../services/companyLogo.service";

function StatCard({ title, value, subtitle }) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {subtitle ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

function EmptyState({ title, text, actionLabel, actionTo }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>

      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-5 inline-flex rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function formatApplicationStatus(status) {
  switch (status) {
    case "applied":
      return "Applied";
    case "reviewing":
      return "Under Review";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    default:
      return status || "Unknown Status";
  }
}

export default function EmployerDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl = null;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        setCompanyLogoUrl("");

        const res = await getEmployerDashboard();
        const dashboardData = res?.data || null;
        setDashboard(dashboardData);

        if (dashboardData?.company?.id) {
          try {
            const blob = await getCompanyLogo();
            objectUrl = URL.createObjectURL(blob);
            setCompanyLogoUrl(objectUrl);
          } catch (logoErr) {
            console.warn("Logo not found or cannot be loaded:", logoErr);
            setCompanyLogoUrl("");
          }
        }
      } catch (err) {
        console.error("Employer dashboard error:", err);
        setError(err?.message || "Unable to load the employer dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  const employer = dashboard?.employer;
  const company = dashboard?.company;
  const stats = dashboard?.stats;
  const recentJobs = useMemo(() => dashboard?.recent_jobs || [], [dashboard]);
  const recentApplications = useMemo(
    () => dashboard?.recent_applications || [],
    [dashboard]
  );

  const hasCompanyProfile = !!company?.id;

  const companyInitial =
    company?.company_name?.trim()?.charAt(0)?.toUpperCase() || "C";

  const dashboardMessage = !hasCompanyProfile
    ? "Complete your company profile to start posting and managing your job listings."
    : stats?.total_jobs === 0
    ? "Your company profile is ready. Publish your first job now."
    : stats?.total_applications === 0
    ? "Your jobs are live. Applications will appear here as soon as candidates apply."
    : `You have received ${stats?.total_applications} application(s), including ${stats?.shortlisted_applications} shortlisted.`;

  if (loading) {
    return (
      <div className="min-h-full bg-[#f4f2ee]">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-600">Loading employer dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-[#f4f2ee]">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
          <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f4f2ee]">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="h-36 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white text-3xl font-bold text-[#0a66c2] shadow-lg">
                  {companyLogoUrl ? (
                    <img
                      src={companyLogoUrl}
                      alt="Company logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    companyInitial
                  )}
                </div>

                <div className="pt-2">
                  <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                    Employer Workspace
                  </div>

                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    Welcome back, {employer?.full_name || "Employer"}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {company?.company_name || "No company profile configured"}
                  </p>

                  <p className="text-sm text-slate-500">{employer?.email}</p>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    {dashboardMessage}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {!hasCompanyProfile ? (
                  <Link
                    to="/employer/company/profile/edit"
                    className="rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
                  >
                    Create Company Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/employer/company/profile/edit"
                      className="rounded-full border border-[#0a66c2] bg-white px-5 py-3 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#e8f3ff]"
                    >
                      Edit Company
                    </Link>

                    <Link
                      to="/employer/jobs/create"
                      className="rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
                    >
                      Create Job Post
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
          <div className="space-y-5">
            {!hasCompanyProfile ? (
              <EmptyState
                title="Start with your company profile"
                text="Once your company profile is created, you will be able to publish job posts, receive applications, and manage your shortlist."
                actionLabel="Create Company Profile"
                actionTo="/employer/company/profile/edit"
              />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Total Jobs"
                    value={stats?.total_jobs ?? 0}
                    subtitle="All job posts published by your company"
                  />
                  <StatCard
                    title="Active Jobs"
                    value={stats?.active_jobs ?? 0}
                    subtitle="Currently open job opportunities"
                  />
                  <StatCard
                    title="Applications"
                    value={stats?.total_applications ?? 0}
                    subtitle="All applications received"
                  />
                  <StatCard
                    title="Shortlist"
                    value={stats?.shortlisted_applications ?? 0}
                    subtitle="Preselected candidate profiles"
                  />
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-5">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Recent Job Posts
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        The latest job opportunities published by your company
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    {recentJobs.length === 0 ? (
                      <EmptyState
                        title="No job posts published yet"
                        text="Your company has not published any jobs yet. Start by creating your first opportunity."
                        actionLabel="Create Job Post"
                        actionTo="/employer/jobs/create"
                      />
                    ) : (
                      <div className="space-y-3">
                        {recentJobs.map((job) => (
                          <div
                            key={job.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                  {job.job_title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                  {job.location || "Location not specified"} •{" "}
                                  {job.employment_type || "Type not specified"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Published on{" "}
                                  {new Date(job.created_at).toLocaleDateString(
                                    "en-GB"
                                  )}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    job.is_active
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {job.is_active ? "Active" : "Inactive"}
                                </span>

                                <Link
                                  to={`/employer/jobs/${job.id}/applicants`}
                                  className="rounded-full border border-[#0a66c2] px-4 py-2 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#e8f3ff]"
                                >
                                  View Candidates
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Recent Applications
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      The latest applications received on your job posts
                    </p>
                  </div>

                  <div className="p-4">
                    {recentApplications.length === 0 ? (
                      <EmptyState
                        title="No recent applications"
                        text="Applications received on your job posts will appear here."
                      />
                    ) : (
                      <div className="space-y-3">
                        {recentApplications.map((application) => (
                          <div
                            key={application.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                  {application.User?.full_name || "Candidate"}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                  {application.User?.email || "Email not provided"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Job:{" "}
                                  <span className="font-medium">
                                    {application.Job?.job_title || "Job Post"}
                                  </span>
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Applied on{" "}
                                  {new Date(
                                    application.application_date
                                  ).toLocaleDateString("en-GB")}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                  {formatApplicationStatus(application.status)}
                                </span>

                                {application.is_shortlisted ? (
                                  <span className="rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                                    Shortlisted
                                  </span>
                                ) : null}

                                <Link
                                  to={`/employer/jobs/${application.job_id}/applicants`}
                                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  Open List
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {hasCompanyProfile ? (
            <aside className="space-y-5">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Company Summary
                </h2>

                <div className="mt-5 space-y-4 text-sm text-slate-700">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Company
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {company?.company_name || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Contact
                    </p>
                    <p className="mt-1">{employer?.email || "Not provided"}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Active Jobs
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {stats?.active_jobs ?? 0}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Applications
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {stats?.total_applications ?? 0}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Shortlist
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {stats?.shortlisted_applications ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Tip
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  A strong employer journey starts with a clear company profile,
                  well-written job posts, and fast application management.
                </p>
              </div>
            </aside>
          ) : (
            <aside className="space-y-5">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Tip
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Start by creating your company profile. After that, you will be
                  able to publish job posts and manage your recruitment activity.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}