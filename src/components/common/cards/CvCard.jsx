import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/constants/function";
import { useDispatch } from "react-redux";
import { downloadCv, setDefault, viewCv, fetchMyCvs } from "@/Redux/cvSlice";
import apiClient from "@/services/api";
import { Eye, Download, Trash2, FileText, Star } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";

export const CvCard = ({ cv }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/api/cvs/${cv.cv_id}`);
      dispatch(fetchMyCvs());
      toast({ title: "CV deleted successfully" });
    } catch {
      toast({ title: "Failed to delete CV", variant: "destructive" });
    }
  };

  return (
    <TableRow className="hover:bg-slate-50 transition-colors">
      {/* Name */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <FileText size={14} className="text-blue-600" />
          </div>
          <span className="text-sm text-gray-800 truncate max-w-[200px]">{cv.file_name}</span>
        </div>
      </TableCell>

      {/* Date */}
      <TableCell className="text-center text-sm text-gray-500">
        {formatDate(cv.uploaded_at)}
      </TableCell>

      {/* Default */}
      <TableCell className="text-center">
        {cv.is_default ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Star size={10} className="fill-blue-600" /> Default
          </span>
        ) : (
          <Button variant="outline" size="sm" onClick={() => dispatch(setDefault(cv.cv_id))}
            className="text-xs h-7 border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600">
            Set Default
          </Button>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => dispatch(viewCv(cv.cv_id))}>
            <Eye size={15} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => dispatch(downloadCv({ id: cv.cv_id, fileName: cv.file_name }))}>
            <Download size={15} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
            onClick={handleDelete}>
            <Trash2 size={15} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};