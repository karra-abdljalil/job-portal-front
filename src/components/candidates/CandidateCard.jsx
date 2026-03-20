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
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "Looking for opportunities"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="h-20 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]" />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="-mt-12 flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#0a66c2] text-lg font-bold text-white ring-4 ring-white shadow-lg">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-[11px] font-semibold text-[#0a66c2]">
                  Candidate Profile
                </div>

                <h3 className="mt-3 truncate text-xl font-bold tracking-tight text-slate-900">
                  {fullName}
                </h3>

                <p className="truncate text-sm font-medium text-slate-700">
                  {title}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                  <span>{location}</span>
                  <span className="text-slate-300">•</span>
                  <span>{experienceLevel}</span>
                  <span className="text-slate-300">•</span>
                  <span>{lastActive}</span>

                  <span
                    className={`ml-1 rounded-full px-2.5 py-0.5 text-xs ring-1 ${statusStyle}`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              <button
                className="rounded-full px-2 py-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                title="More options"
                type="button"
              >
                ⋯
              </button>
            </div>

            {skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.slice(0, 10).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
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
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                isShortlisted
                  ? "bg-[#0a66c2] text-white hover:bg-[#004182]"
                  : "border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff]"
              } ${shortlistLoading ? "cursor-not-allowed opacity-60" : ""}`}
              type="button"
            >
              {shortlistLoading
                ? "Loading..."
                : isShortlisted
                ? "★ Shortlisted"
                : "+ Shortlist"}
            </button>

            <button
              className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              type="button"
              onClick={() => alert("To be connected later: messaging")}
            >
              Message
            </button>

            {cvId ? (
              <button
                onClick={handleDownloadCv}
                className="rounded-full border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                type="button"
                title={cvFileName || "Download CV"}
              >
                Download CV
              </button>
            ) : (
              <button
                disabled
                className="cursor-not-allowed rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400"
                title="CV not available"
                type="button"
              >
                Download CV
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 md:hidden">
          <button
            onClick={handleShortlist}
            disabled={shortlistLoading}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              isShortlisted
                ? "bg-[#0a66c2] text-white hover:bg-[#004182]"
                : "border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff]"
            } ${shortlistLoading ? "cursor-not-allowed opacity-60" : ""}`}
            type="button"
          >
            {shortlistLoading
              ? "Loading..."
              : isShortlisted
              ? "★ Shortlisted"
              : "+ Shortlist"}
          </button>

          <button
            className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            type="button"
            onClick={() => alert("To be connected later: messaging")}
          >
            Message
          </button>

          {cvId ? (
            <button
              onClick={handleDownloadCv}
              className="rounded-full border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              type="button"
            >
              Download CV
            </button>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400"
              title="CV not available"
              type="button"
            >
              Download CV
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-600">
        <span>Profile updated recently</span>
        <button
          className="font-semibold text-[#0a66c2] transition hover:underline"
          type="button"
          onClick={() => alert("To be connected later: candidate profile page")}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}