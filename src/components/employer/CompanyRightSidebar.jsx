import React, { useState } from "react";

const initialPages = [
  { id: 1, name: "Tech Solutions Maroc", field: "Informatique", followed: false },
  { id: 2, name: "Digital Maroc", field: "Services et conseil en informatique", followed: false },
  { id: 3, name: "InnoviTech", field: "Informatique", followed: false },
];

export default function CompanyRightSidebar() {
  const [pages, setPages] = useState(initialPages);

  const toggleFollow = (id) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id ? { ...page, followed: !page.followed } : page
      )
    );
  };

  const handleViewMore = () => {
    alert("Liste complète des pages similaires bientôt disponible.");
  };

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900">Pages similaires</h3>

        <div className="mt-6 space-y-5">
          {pages.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#1d4ed8] to-[#0ea5e9] text-lg font-bold text-white">
                {item.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-gray-900">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">{item.field}</p>

                <button
                  type="button"
                  onClick={() => toggleFollow(item.id)}
                  className="mt-3 rounded-full border border-gray-400 px-4 py-2 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  {item.followed ? "✓ Suivi" : "+ Suivre"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleViewMore}
          className="mt-6 w-full text-left text-xl font-semibold text-gray-700 hover:underline"
        >
          Voir plus de pages similaires →
        </button>
      </div>

      <div className="rounded-2xl border border-[#e0dfdc] bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900">Pages affiliées</h3>
        <p className="mt-4 text-2xl font-bold text-gray-900">
          Aucune page affiliée
        </p>
        <p className="mt-3 text-base leading-7 text-gray-600">
          Les pages affiliées sont des pages LinkedIn liées à cette page d’entreprise.
        </p>
      </div>
    </aside>
  );
}