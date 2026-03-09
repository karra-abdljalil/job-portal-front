import React from "react";

const tabs = ["Accueil", "À propos", "Posts", "Emplois", "Personnes"];

export default function CompanyLinkedInTabs({ activeTab, onTabChange }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e0dfdc] bg-white shadow-sm">
      <div className="flex flex-wrap gap-1 px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`border-b-4 px-5 py-4 text-base font-semibold transition ${
                isActive
                  ? "border-[#057642] text-[#057642]"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}