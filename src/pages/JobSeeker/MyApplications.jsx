import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyApplications } from "../../Redux/applicationSlice";
import ApplicationCard from "../../components/common/cards/applicationCard";
import { ApplicationHeader } from "../../components/common/Headers/ApplicationHeader";
import useDebounce from "../../hooks/useDebounce";
import StatusCard from "../../components/common/cards/statusCard";

export default function MyApplicationsPage() {
  const dispatch = useDispatch();
  const {
    items: applications,
    loading,
    error,
    pagination,
    counts,
  } = useSelector((state) => state.applications);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [debouncedSearch, cancelDebounce] = useDebounce(search.trim(), 500);


  useEffect(() => {
    if (debouncedSearch.length < 3 && debouncedSearch !== "") return;
    dispatch(
      fetchMyApplications({ search: debouncedSearch, page, limit }),
    );
    return () => cancelDebounce();
  }, [dispatch, debouncedSearch, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const statusCards = [
    { title: "total", value: counts.total_app, color: "blue-800" },
    { title: "rejected", value: counts.rejected_app, color: "red-600" },
    { title: "Interviews", value: counts.interview_app, color: "fuchsia-600" },
    { title: "under-review", value: counts.underReview_app, color: "orange-600" },
  ];

  return (
    <div className="py-10 ">
      <ApplicationHeader
        title="My Applications"
        para={`View and manage ${counts.total_app} applications for your posted jobs`}
        placeholder="Search by job title or status..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <main className="w-full flex flex-col md:flex-row gap-10 bg-slate-100 rounded-2xl py-4 px-6">
        <section className="flex-1">
          {/* to check style not completed */}
          <div className=" ">
            {loading && <p>Loading applications...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && applications.length === 0 && (
              <p>No applications found.</p>
            )}

            {!loading &&
              applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}

            {/* pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 my-10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-white bg-blue-900 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 text-white bg-blue-900 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right side: Insights */}
        <aside className=" py-4 px-4">
          <div className="bg-white border rounded-lg p-4 shadow">
            <h6 className="font-semibold text-center capitalize border-b pb-3 text-gray-700 mb-4">
              Application Insights
            </h6>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              {statusCards.map((card) => (
                <StatusCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  color={card.color}
                />
              ))}
            </div>
            
          </div>
        </aside>
      </main>
    </div>
  );
}
