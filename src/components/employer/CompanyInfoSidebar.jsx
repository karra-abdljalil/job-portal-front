import React from "react";

export default function CompanyInfoSidebar() {
  return (
    <aside className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Tips
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          A complete company profile improves the credibility of your job posts
          and strengthens your employer brand.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Next Step
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          After this page, you can add company logo upload to make the profile
          more complete and professional.
        </p>
      </div>
    </aside>
  );
}