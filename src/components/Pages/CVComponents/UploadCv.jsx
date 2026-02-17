import { uploadCvThunk } from "../../../Redux/cvSlice";
import { useToast } from "../../../hooks/use-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../ui/button";

export const UploadCv = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading ,setUploading] = useState(false)
  const [progress,setProgress] = useState(0)

  const validateFile = (file) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const maxSize = 5 * 1024 * 1024;
    if (!file) return false;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      toast({
        title: "Error",
        description: "Invalide file type",
        variant: "destructive",
      });
      return false;
    }
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "file to large max size is 5 MB",
        variant: "destructive",
      });
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
    setDragActive(false)
    const droppedfile = e.dataTransfer.files[0]
    if(droppedfile) handleFile(droppedfile)
  };


//   submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Error",
        description: "no file seleceted",
        variant: "destructive",
      });
      return;
    }
    const formData = new FormData();
    formData.append("cv_file", file);

    // for the test
    const id = "59d04c22-9d7c-4be5-8f61-16da54552bbe";
    try {
        await dispatch(uploadCvThunk({ formData, id })).unwrap()
       toast({title: "Success",description: "Cv uploaded successfully",variant: "success",});
        setFile(null);

    } catch (error) {
        toast({ title: "Upload failed",variant: "destructive",});
    }finally{
        setUploading(false)
        setProgress(0)
    }
  };

  return (
    <section className="max-w-md mx-auto mt-6">
      <form
        onSubmit={handleSubmit}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        
      >
        <div className={` text-center border-2 border-dashed p-6 rounded-lg relative transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
        }`}>
          {file ? (
            <p className="text-gray-700 font-medium">Selected file: {file.name}</p>
          ) : (
            <p className="text-gray-500">Drag & drop your CV here or click to select a file</p>
          )}
          <input
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFile(e.target.files[0])}
          />
       

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
         </div>

        <Button type="submit" disabled={uploading} className="mt-4 w-full">
          {uploading ? "Uploading..." : "Upload CV"}
        </Button>
      </form>
    </section>
  );
};
