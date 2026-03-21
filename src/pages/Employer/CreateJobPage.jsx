import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createEmployerJob } from "../../services/employerJobs.service";

const EMPLOYMENT_OPTIONS = ["CDI", "CDD", "Stage", "Freelance", "Temporaire"];

export default function CreateJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    job_title: "",
    job_description: "",
    experience_level: "",
    employment_type: "",
    salary_range: "",
    location: "",
    skills: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        salary_range: form.salary_range ? String(form.salary_range) : null,
      };

      const res = await createEmployerJob(payload);
      const createdJob = res?.data;

      setSuccess("Job post created successfully.");

      setTimeout(() => {
        if (createdJob?.id) {
          navigate(`/employer/jobs/${createdJob.id}`);
        } else {
          navigate("/employer/jobs");
        }
      }, 700);
    } catch (err) {
      console.error("Create job error:", err);
      console.error("response data:", err?.response?.data);

      const apiErrors = err?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        setError(apiErrors.join(" | "));
      } else {
        setError(
          err?.message ||
            err?.response?.data?.message ||
            "Unable to create the job post."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f4f2ee] py-6">
      <div className="mx-auto max-w-5xl space-y-5 px-4">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

          <div className="px-6 pb-6 pt-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                  Job Creation
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  Create Job Post
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Publish a new opportunity to attract top candidates.
                </p>
              </div>

              <Link
                to="/employer/jobs"
                className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to My Jobs
              </Link>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Main Information
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="job_title"
                    value={form.job_title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer React"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Employment Type
                  </label>
                  <select
                    name="employment_type"
                    value={form.employment_type}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
                  >
                    <option value="">Select</option>
                    {EMPLOYMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    name="experience_level"
                    value={form.experience_level}
                    onChange={handleChange}
                    placeholder="e.g. Junior, Mid, Senior"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary_range"
                    value={form.salary_range}
                    onChange={handleChange}
                    placeholder="e.g. 9000"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Casablanca"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, JavaScript, Tailwind"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Separate skills with commas.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Job Description
              </h2>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="job_description"
                  value={form.job_description}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Describe the role, responsibilities, required profile, and expectations..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0a66c2] focus:ring-4 focus:ring-[#0a66c2]/10"
                />
              </div>
            </div>

            {(error || success) && (
              <div
                className={`rounded-[28px] border bg-white p-4 shadow-sm ${
                  error ? "border-red-200" : "border-emerald-200"
                }`}
              >
                <p className={`text-sm ${error ? "text-red-600" : "text-emerald-700"}`}>
                  {error || success}
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Publishing Tips
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use a clear title, specify the employment type, location, and
                expected skills to attract the most relevant candidates.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </h2>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={`rounded-2xl bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004182] ${
                    saving ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  {saving ? "Publishing..." : "Publish Job Post"}
                </button>

                <Link
                  to="/employer/jobs"
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}