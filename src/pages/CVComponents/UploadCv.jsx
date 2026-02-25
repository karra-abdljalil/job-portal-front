import { uploadCvThunk,fetchMyCvs } from "../../Redux/cvSlice";
import { useToast } from "../../components/hooks/use-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../components/ui/button";

export const UploadCv = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);


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

    try {
        await dispatch(uploadCvThunk({ formData })).unwrap()
       toast({title: "Success",description: "Cv uploaded successfully",variant: "success",});
        setFile(null);

        dispatch(fetchMyCvs());
    } catch (error) {
        toast({ title: "Upload failed",variant: "destructive",});
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
    
         </div>

        <Button type="submit" className="mt-4 w-full">
         Upload CV
        </Button>
      </form>
    </section>
  );
};
