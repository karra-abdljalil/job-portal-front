import { Card, CardContent } from "../../ui/card";
import { formatDate, formatRelativeDate } from "../../../constants/function";
import { AppliedStatus } from "../../StatusBadge/AppliedStatus";
import { ReviewedStatus } from "../../StatusBadge/ReviewedStatus";
import { InterviewStatus } from "../../StatusBadge/InterviewStatus";
import OfferStatus from "../../StatusBadge/OfferStatus";
import RejectedStatus from "../../StatusBadge/RejectedStatus";
import StatusBadge from "../../StatusBadge/statusBadge";
import { APPLICATION_STATUS } from "../../../constants/StatusConstant";

export default function ApplicationCard({ application }) {
  const STATUS_COMPONENTS = {
    [APPLICATION_STATUS.APPLIED.value]: AppliedStatus,
    [APPLICATION_STATUS.REVIEWED.value]: ReviewedStatus,
    [APPLICATION_STATUS.INTERVIEW.value]: InterviewStatus,
    [APPLICATION_STATUS.OFFER.value]: OfferStatus,
    [APPLICATION_STATUS.REJECTED.value]: RejectedStatus,
  };

  const StatusComponent = STATUS_COMPONENTS[application.status];

  return (
    <Card className=" rounded-2xl hover:shadow-md transition-all duration-300 m-4 py-2 px-4 bg-white">
      <CardContent className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-14 h-14 rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
              <img
                src={`http://localhost:5000/uploads/companies_logo/${application.Job?.Company?.logo}`}
                alt="company logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Job Info */}
            <div className="space-y-1">
              <h4 className="text-lg font-semibold">
                {application.Job?.job_title}
              </h4>

              <p className="text-sm text-muted-foreground">
                {application.Job?.location} •{" "}
                {application?.Job?.employment_type}
              </p>

              <p className="text-xs text-muted-foreground">
                Applied on {formatDate(application.application_date)} •{" "}
                {formatRelativeDate(application.application_date)}
              </p>
            </div>
          </div>

          <StatusBadge status={application?.status} />
        </div>

        <div className="">
          {StatusComponent && <StatusComponent application={application} />}
        </div>
      </CardContent>
    </Card>
  );
}
