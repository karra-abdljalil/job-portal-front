import React, { useEffect, useState } from "react";
import { getCompanyLogo, uploadCompanyLogo } from "../../services/companyLogo.service";

export default function CompanyLogoUploader() {
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let objectUrl = null;

    const fetchLogo = async () => {
      try {
        setLoadingLogo(true);
        const blob = await getCompanyLogo();
        objectUrl = URL.createObjectURL(blob);
        setLogoUrl(objectUrl);
      } catch (err) {
        setLogoUrl("");
      } finally {
        setLoadingLogo(false);
      }
    };

    fetchLogo();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please choose an image file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await uploadCompanyLogo(selectedFile);
      setSuccess("Logo updated successfully.");

      const blob = await getCompanyLogo();
      const objectUrl = URL.createObjectURL(blob);
      setLogoUrl(objectUrl);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setError("Unable to upload the logo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
          Brand Identity
        </div>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Company Logo
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Add or replace your company logo to strengthen your employer brand.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
          {loadingLogo ? (
            <span className="px-2 text-center text-xs text-slate-500">
              Loading...
            </span>
          ) : logoUrl ? (
            <img
              src={logoUrl}
              alt="Company logo"
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <span className="px-3 text-center text-xs text-slate-500">
              No logo
            </span>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-[#e8f3ff] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#0a66c2] hover:file:bg-[#dbeafe]"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004182] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Update Logo"}
          </button>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}