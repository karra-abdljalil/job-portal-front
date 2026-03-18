import { uploadCvThunk, fetchMyCvs } from "@/Redux/cvSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";

export const UploadCv = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateFile = (file) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const maxSize = 5 * 1024 * 1024;
    if (!file) return false;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast({ title: "Invalid file type", description: "Only PDF, DOC, DOCX allowed.", variant: "destructive" });
      return false;
    }
    if (file.size > maxSize) {
      toast({ title: "File too large", description: "Maximum size is 5MB.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleFile = (uploadedFile) => {
    if (validateFile(uploadedFile)) setFile(uploadedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragover" || e.type === "dragenter") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("cv_file", file);
    setLoading(true);
    try {
      await dispatch(uploadCvThunk({ formData })).unwrap();
      toast({ title: "CV uploaded successfully" });
      setFile(null);
      dispatch(fetchMyCvs());
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
      <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        dragActive ? "border-blue-400 bg-blue-50" : file ? "border-blue-300 bg-blue-50/50" : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
      }`}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={20} className="text-blue-600 shrink-0" />
            <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-gray-400 hover:text-red-500 transition-colors z-10 relative">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto">
              <Upload size={18} className="text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Drag & drop your CV here</p>
            <p className="text-xs text-gray-400">PDF, DOC, DOCX — max 5MB</p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={!file || loading} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white">
        {loading ? "Uploading..." : "Upload CV"}
      </Button>
    </form>
  );
};