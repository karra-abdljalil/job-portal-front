import { Cvs } from "../CVComponents/Cvs";
import { UploadCv } from "../CVComponents/UploadCv";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCvs } from "@/Redux/cvSlice";
import { useEffect } from "react";
import Loading from "@/pages/system/Loading";

export const MyCvs = () => {
  const dispatch = useDispatch();
  const { items: cvs, loading, error } = useSelector((state) => state.cv);

  // Fetch CVs on mount
  useEffect(() => {
    dispatch(fetchMyCvs());
  }, [dispatch]);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="space-y-6 p-6">
      {/* Upload CV form */}
      <UploadCv />

      {/* Table of uploaded CVs */}
      <Cvs cvs={cvs} />
    </main>
  );
};
