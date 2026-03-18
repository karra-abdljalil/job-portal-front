import React, { useMemo, useState } from "react";
import axios from "axios";
import { toggleShortlist } from "@/services/shortlist.service";

export default function CandidateCard({ candidate }) {
  const {
    id,
    applicationId,
    fullName,
    title,
    location,
    experienceLevel,
    skills = [],
    cvId,
    cvFileName,
    lastActive = "Recently active",
    status = "Available",
    isShortlisted: initialShortlisted = false,
  } = candidate;

  const initials = useMemo(() => {
    return fullName
      ? fullName
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase())
          .join("")
      : "C";
  }, [fullName]);

  const [isShortlisted, setIsShortlisted] = useState(initialShortlisted);
  const [shortlistLoading, setShortlistLoading] = useState(false);

  const handleShortlist = async () => {
    if (!applicationId || shortlistLoading) return;

    try {
      setShortlistLoading(true);

      const nextValue = !isShortlisted;
      const res = await toggleShortlist(applicationId, nextValue);

      setIsShortlisted(res?.application?.is_shortlisted ?? nextValue);
    } catch (err) {
      console.error("Shortlist error:", err);
      alert("Unable to update the shortlist.");
    } finally {
      setShortlistLoading(false);
    }
  };

  const handleDownloadCv = async () => {
    if (!cvId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/cvs/download/${cvId}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = cvFileName || "cv.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download CV error:", err);
      alert("Unable to download the CV. Please make sure you are logged in.");
    }
  };

  const statusStyle =
    status === "Available"
      ? "bg-green-50 text-green-700 ring-green-200"
      : status === "Looking for opportunities"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : "bg-gray-50 text-gray-700 ring-gray-200";

  return (
    <div className="overflow-hidden rounded-xl border border-[#e0dfdc] bg-white shadow-sm transition hover:shadow-md">
      <div className="h-14 bg-gradient-to-r from-[#dbeafe] via-[#e0f2fe] to-[#f1f5f9]" />

      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="-mt-9 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0a66c2] text-base font-bold text-white ring-4 ring-white">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-gray-900">
                  {fullName}
                </h3>
                <p className="truncate text-sm text-gray-700">{title}</p>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
                  <span>{location}</span>
                  <span className="text-gray-300">•</span>
                  <span>{experienceLevel}</span>
                  <span className="text-gray-300">•</span>
                  <span>{lastActive}</span>

                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs ring-1 ${statusStyle}`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              <button
                className="rounded-full px-2 py-1 text-gray-500 hover:bg-gray-100"
                title="More options"
                type="button"
              >
                ⋯
              </button>
            </div>

            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.slice(0, 10).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="hidden shrink-0 flex-col gap-2 md:flex">
            <button
              onClick={handleShortlist}
              disabled={shortlistLoading}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isShortlisted
                  ? "bg-[#0a66c2] text-white hover:bg-[#004182]"
                  : "border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff]"
              } ${shortlistLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              type="button"
            >
              {shortlistLoading
                ? "Loading..."
                : isShortlisted
                ? "★ Shortlisted"
                : "+ Shortlist"}
            </button>

            <button
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              type="button"
              onClick={() => alert("To be connected later: messaging")}
            >
              Message
            </button>

            {cvId ? (
              <button
                onClick={handleDownloadCv}
                className="rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                type="button"
                title={cvFileName || "Download CV"}
              >
                Download CV
              </button>
            ) : (
              <button
                disabled
                className="cursor-not-allowed rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-400"
                title="CV not available"
                type="button"
              >
                Download CV
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 md:hidden">
          <button
            onClick={handleShortlist}
            disabled={shortlistLoading}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isShortlisted
                ? "bg-[#0a66c2] text-white hover:bg-[#004182]"
                : "border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff]"
            } ${shortlistLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            type="button"
          >
            {shortlistLoading
              ? "Loading..."
              : isShortlisted
              ? "★ Shortlisted"
              : "+ Shortlist"}
          </button>

          <button
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            type="button"
            onClick={() => alert("To be connected later: messaging")}
          >
            Message
          </button>

          {cvId ? (
            <button
              onClick={handleDownloadCv}
              className="rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              type="button"
            >
              Download CV
            </button>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-400"
              title="CV not available"
              type="button"
            >
              Download CV
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#e0dfdc] px-4 py-3 text-xs text-gray-600">
        <span>Profile updated recently</span>
        <button
          className="font-semibold text-[#0a66c2] hover:underline"
          type="button"
          onClick={() => alert("To be connected later: candidate profile page")}
        >
          View profile
        </button>
      </div>
    </div>
  );
}