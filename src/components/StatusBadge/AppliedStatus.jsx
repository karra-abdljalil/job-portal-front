import { ButtonRedirect } from "../common/Ui/ButtonRedirect";

export const AppliedStatus = ({ application }) => {
  return (
    <div className="flex justify-end w-full">

        <ButtonRedirect
          link={`/jobDetail/${application.Job?.id}`}
          buttonName="View Job Details"
        variant={'detailButtom'}
        size={'default'}
          />
    </div>
  );
};
