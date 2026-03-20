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
      setError("Veuillez choisir un fichier image.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await uploadCompanyLogo(selectedFile);
      setSuccess("Logo mis à jour avec succès.");

      const blob = await getCompanyLogo();
      const objectUrl = URL.createObjectURL(blob);
      setLogoUrl(objectUrl);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setError("Impossible de téléverser le logo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Logo entreprise</h2>
      <p className="mt-1 text-sm text-gray-600">
        Ajoutez ou remplacez le logo de votre entreprise.
      </p>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-[#f8fafc]">
          {loadingLogo ? (
            <span className="text-xs text-gray-500">Chargement...</span>
          ) : logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo entreprise"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500 text-center px-2">
              Aucun logo
            </span>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-[#e8f3ff] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0a66c2] hover:file:bg-[#dbeafe]"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-full bg-[#0a66c2] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#004182] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Téléversement..." : "Mettre à jour le logo"}
          </button>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}