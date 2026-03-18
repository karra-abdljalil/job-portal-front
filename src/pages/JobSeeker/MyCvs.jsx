import { useDispatch, useSelector } from "react-redux";
import { fetchMyCvs } from "@/Redux/cvSlice";
import { useEffect } from "react";
import { UploadCv } from "../CVComponents/UploadCv";
import { CvCard } from "@/components/common/cards/CvCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { CvModalDetail } from "@/components/Modal/CvModalDetail";

export const MyCvs = () => {
  const dispatch = useDispatch();
  const { items: cvs, loading, error } = useSelector((state) => state.cv);

  useEffect(() => {
    dispatch(fetchMyCvs());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Resumes</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your uploaded CVs and set a default for applications</p>
      </div>

      {/* ── Upload Section ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">Upload New CV</h2>
        <UploadCv />
      </div>

      {/* ── CVs Table ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Uploaded CVs
            <span className="ml-2 text-xs font-normal text-gray-400">({cvs?.length || 0})</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-xs text-red-500 p-6">{error}</p>
        ) : !cvs || cvs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <FileText size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">No CVs uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload your first CV above</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="text-xs font-semibold text-gray-500">File Name</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 text-center">Upload Date</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 text-center">Status</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cvs.map((cv, index) => (
                <CvCard key={cv.cv_id || index} cv={cv} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CvModalDetail />
    </div>
  );
};