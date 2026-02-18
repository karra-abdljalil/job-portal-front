import { formatDate } from "../../constants/function";
import { Button } from "../ui/button";
import { useState } from "react";
import InterviewDetailsModal from "../Modal/interviewDetails";

export const InterviewStatus = ({ application }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div >
          <p className="text-sm text-muted capitalize">
            {application.interview_type} interview on{" "}
            <span className="font-medium text-foreground">
              {formatDate(application.interview_date)}
            </span>
          </p>
        </div>

        <Button onClick={() => setOpen(true)} 
            variant='interviewDetail' size='default'>More Details</Button>
      </div>

      <InterviewDetailsModal
        open={open}
        setOpen={setOpen}
        application={application}
      />
    </>
  );
};
