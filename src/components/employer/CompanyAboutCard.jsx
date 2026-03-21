import React from "react";

export default function CompanyAboutCard({ company }) {
  const { description, industry, location, company_name } = company;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          About
        </h2>
      </div>

      <div className="space-y-8 px-6 py-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Overview
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {description || "No company description has been added yet."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Company Name
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {company_name || "Not provided"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Industry
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {industry || "Not provided"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Location
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {location || "Not provided"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Status
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              Company profile active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}