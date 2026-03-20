import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createCompany,
  getMyCompany,
  updateMyCompany,
} from "../../services/company.service";
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
  const [hasCompany, setHasCompany] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const res = await getMyCompany();
        const company = res?.company || null;

        if (company) {
          setHasCompany(true);
          setForm({
            company_name: company.company_name || "",
            description: company.description || "",
            industry: company.industry || "",
            location: company.location || "",
          });
        } else {
          setHasCompany(false);
          setForm({
            company_name: "",
            description: "",
            industry: "",
            location: "",
          });
        }
      } catch (err) {
        console.error("getMyCompany error:", err);
        console.error("response data:", err?.response?.data);
        console.error("status:", err?.response?.status);

        setError(
          err?.response?.data?.message ||
            "Unable to load the company profile."
        );
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

      if (hasCompany) {
        await updateMyCompany(form);
        setSuccess("Company profile updated successfully.");
      } else {
        await createCompany(form);
        setHasCompany(true);
        setSuccess("Company profile created successfully.");

        setTimeout(() => {
          navigate("/employer/company/profile");
        }, 800);
      }
    } catch (err) {
      console.error("company submit error:", err);
      console.error("response data:", err?.response?.data);
      console.error("status:", err?.response?.status);

      setError(
        err?.response?.data?.message ||
          (hasCompany
            ? "Unable to update the company profile."
            : "Unable to create the company profile.")
      );
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = hasCompany
    ? "Edit Company Profile"
    : "Create Company Profile";

  const pageDescription = hasCompany
    ? "Update the information displayed on your company page."
    : "Complete your company information to start posting jobs.";

  return (
    <div className="min-h-screen bg-[#f4f2ee] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

          <div className="px-6 pb-6 pt-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                  Company Settings
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {pageTitle}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {pageDescription}
                </p>
              </div>

              {hasCompany ? (
                <Link
                  to="/employer/company/profile"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ← Back to Profile
                </Link>
              ) : (
                <Link
                  to="/employer/dashboard"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ← Back to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            {hasCompany ? <CompanyLogoUploader /> : null}

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

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Tips
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Provide a clear company name, a strong description, and an
                accurate location to build a professional brand image.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Best Practices
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A complete profile builds candidate trust and improves the
                quality of applications you receive.
              </p>
            </div>

            {!hasCompany ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Before You Start
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Once your company is created, you will be able to upload your
                  logo, publish jobs, and track applications.
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}