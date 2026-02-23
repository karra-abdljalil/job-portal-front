import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { closeModal } from "@/Redux/cvSlice";
import Loading from "@/pages/system/Loading";

export const CvModalDetail = () => {
  const dispatch = useDispatch();
  const { cvUrl, isModalOpen, loading } = useSelector((state) => state.cv);

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && dispatch(closeModal())}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>View CV</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <Loading/>
          ) : cvUrl ? (
            <embed
              src={cvUrl}
              type="application/pdf"
              width="100%"
              height="600px"
              className="rounded-lg border"
            />
          ) : (
            <p className="text-center text-muted-foreground">No CV available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
