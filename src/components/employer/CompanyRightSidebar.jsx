import React from "react";

export default function CompanyRightSidebar({ company }) {
  return (
    <aside className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Company Summary
        </h3>

        <div className="mt-5 space-y-4 text-sm">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Company
            </p>
            <p className="mt-1 font-medium text-slate-900">
              {company?.company_name || "Not provided"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Industry
            </p>
            <p className="mt-1 text-slate-700">
              {company?.industry || "Not provided"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Location
            </p>
            <p className="mt-1 text-slate-700">
              {company?.location || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Tip
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          A clear company profile builds candidate trust and makes your job posts
          more attractive.
        </p>
      </div>
    </aside>
  );
}