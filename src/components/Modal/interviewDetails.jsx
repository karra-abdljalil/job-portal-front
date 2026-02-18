import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { formatDate } from "../../constants/function";

export default function InterviewDetailsModal({ open, setOpen, application }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl bg-white p-6 shadow-lg max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Interview Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3 text-sm text-gray-700">
          <p className="flex">
            <span className="font-medium w-32">Interview Type:</span>
            <span>{application.interview_type || "Not specified"}</span>
          </p>

          <p className="flex">
            <span className="font-medium w-32">Date:</span>
            <span>{formatDate(application.interview_date) || "Not specified"}</span>
          </p>

          <p className="flex">
            <span className="font-medium w-32">Time:</span>
            <span>{application.interview_time || "Not specified"}</span>
          </p>

          <p className="flex">
            <span className="font-medium w-32">Location / Link:</span>
            <span>{application.interview_location || "Not specified"}</span>
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
