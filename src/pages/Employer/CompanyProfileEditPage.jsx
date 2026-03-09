import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCompany, updateMyCompany } from "../../services/company.service";
import CompanyLogoUploader from "../../components/employer/CompanyLogoUploader";
import CompanyProfileForm from "../../components/employer/CompanyProfileForm";

export default function CompanyProfileEditPage() {
  const [form, setForm] = useState({
    company_name: "",
    description: "",
    industry: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getMyCompany();
        const company = res.company || res.data || res;

        setForm({
          company_name: company.company_name || "",
          description: company.description || "",
          industry: company.industry || "",
          location: company.location || "",
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le profil entreprise.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

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

      await updateMyCompany(form);
      setSuccess("Profil entreprise mis à jour avec succès.");
    } catch (err) {
      console.error(err);
      setError("Impossible de mettre à jour le profil entreprise.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Modifier le profil entreprise
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Mettez à jour les informations visibles sur votre page entreprise.
            </p>
          </div>

          <Link
            to="/employer/company/profile"
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-white"
          >
            ← Retour au profil
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <CompanyLogoUploader />

            <CompanyProfileForm
              form={form}
              loading={loading}
              saving={saving}
              error={error}
              success={success}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Conseils</h2>
              <p className="mt-2 text-sm text-gray-600">
                Renseignez un nom clair, une description précise et une localisation correcte.
              </p>
            </div>

            <div className="rounded-xl border border-[#e0dfdc] bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Bonnes pratiques</h2>
              <p className="mt-2 text-sm text-gray-600">
                Un profil complet renforce la confiance des candidats et améliore la qualité des candidatures.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}