import React from "react";
import { Link } from "react-router-dom";

export default function CompanyLinkedInHero({ company }) {
  const {
    company_name,
    description,
    industry,
    location,
    logoUrl,
  } = company;

  const initial = company_name?.trim()?.charAt(0)?.toUpperCase() || "C";

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44 bg-gradient-to-r from-[#0a66c2] via-[#378fe9] to-[#70b5f9]">
        <div className="absolute left-6 bottom-0 translate-y-1/2">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Company logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#0a66c2] text-3xl font-bold text-white">
                {initial}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex rounded-full bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#0a66c2]">
              Company Profile
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              {company_name || "Company Name"}
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-600">
              {[industry, location].filter(Boolean).join(" • ") ||
                "Industry and location not specified"}
            </p>

            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-700">
              {description ||
                "Add a company description to better present your business and attract top candidates."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3 lg:pt-10">
            <Link
              to="/employer/company/profile/edit"
              className="rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004182]"
            >
              Edit Profile
            </Link>

            <Link
              to="/employer/dashboard"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}