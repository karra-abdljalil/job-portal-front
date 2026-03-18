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

      setSuccess("Offre créée avec succès.");

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
            "Impossible de créer l’offre."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f3f2ef]">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Créer une offre
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Publiez une nouvelle opportunité pour attirer les meilleurs candidats.
              </p>
            </div>

            <Link
              to="/employer/jobs"
              className="inline-flex rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Retour à mes offres
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Informations principales
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Titre du poste *
                  </label>
                  <input
                    type="text"
                    name="job_title"
                    value={form.job_title}
                    onChange={handleChange}
                    placeholder="Ex: Frontend Developer React"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Type d’emploi
                  </label>
                  <select
                    name="employment_type"
                    value={form.employment_type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
                  >
                    <option value="">Sélectionner</option>
                    {EMPLOYMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Niveau d’expérience
                  </label>
                  <input
                    type="text"
                    name="experience_level"
                    value={form.experience_level}
                    onChange={handleChange}
                    placeholder="Ex: Junior, Mid, Senior"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Salaire
                  </label>
                  <input
                    type="text"
                    name="salary_range"
                    value={form.salary_range}
                    onChange={handleChange}
                    placeholder="Ex: 9000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Localisation
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ex: Casablanca"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Compétences
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Ex: React, JavaScript, Tailwind"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Sépare les compétences par des virgules.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Description du poste
              </h2>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="job_description"
                  value={form.job_description}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Décris les missions, le profil recherché, les responsabilités..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
                />
              </div>
            </div>

            {(error || success) && (
              <div
                className={`rounded-2xl border bg-white p-4 shadow-sm ${
                  error ? "border-red-200" : "border-green-200"
                }`}
              >
                <p className={`text-sm ${error ? "text-red-600" : "text-green-600"}`}>
                  {error || success}
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">
                Conseils de publication
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Utilise un titre clair, précise le type d’emploi, la localisation
                et les compétences attendues pour attirer des profils pertinents.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Actions</h2>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={`rounded-xl bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004182] ${
                    saving ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  {saving ? "Publication..." : "Publier l’offre"}
                </button>

                <Link
                  to="/employer/jobs"
                  className="rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Annuler
                </Link>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}