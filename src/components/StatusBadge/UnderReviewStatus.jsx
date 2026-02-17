import { formatRelativeDate } from "../../constants/function";
import { ButtonRedirect } from "../common/Ui/ButtonRedirect";

export const UnderReviewStatus = ({ application }) => {
  return (
    <div className="flex items-center justify-between bg-muted/40">
      
      <div className="space-y-1">
        <p className="text-sm font-muted text-gray-500">
          Reviewed {formatRelativeDate(application.status_updated_at)}
        </p>

        <p className="text-sm text-muted text-gray-500">
          You can expect a response within {' '}
          <span className="font-medium text-foreground">
            {application.estimated_review_days} days
          </span> {' '} .
        </p>
      </div>

      <ButtonRedirect
        link={`/jobDetail/${application.Job?.id}`}
        buttonName="View Job Details"
        variant="detailButtom"
        size="default"
      />
    </div>
  );
};
