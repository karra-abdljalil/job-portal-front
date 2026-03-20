import React from "react";

const tabs = ["Accueil", "À propos", "Posts", "Emplois", "Personnes"];

const tabLabels = {
  Accueil: "Home",
  "À propos": "About",
  Posts: "Posts",
  Emplois: "Jobs",
  Personnes: "People",
};

export default function CompanyLinkedInTabs({ activeTab, onTabChange }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-1 px-4 py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`relative rounded-t-2xl px-5 py-4 text-sm font-semibold transition ${
                isActive
                  ? "text-[#0a66c2]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tabLabels[tab] || tab}

              <span
                className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full transition-all ${
                  isActive
                    ? "w-10 bg-[#0a66c2]"
                    : "w-0 bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}