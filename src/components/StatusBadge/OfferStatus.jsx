import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { decideOfferThunk, optimisticUpdate } from "../../Redux/applicationSlice";
import StatusBadge from "./statusBadge";
import { useToast } from "../../hooks/use-toast";
export default function OfferStatus({ application }) {
  const dispatch = useDispatch();
  const {toast} = useToast()
 
  // Determine if a decision has already been made
  const decisionMade = application.status === "accepted" || application.status === "declined";

  const handleDispatch = (decision) => {
  // update instantly
  dispatch(optimisticUpdate ({id:application.id,status:decision}));

  // Call backend
  dispatch(decideOfferThunk({ appId: application.id, decision }))
    .unwrap()
    .then(()=>{
      toast({
        title:'Email sent successfuly',
        description:`the employer has been notified that you ${decision} the offer`,
        variant:'success'
      })
    })
    .catch((err) => {
      toast({
        title:'Something went wrong',
        description:'Failed to send email.Please try again',
        variant: "destructive",
      })
    });
};

  if (decisionMade) {
    return (<StatusBadge status={application?.status} />
    )
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex-1 text-left">
        <p className="text-md font-semibold text-green-700">
          🎉 Congratulations! You received an offer.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors duration-200"
          onClick={() => handleDispatch("accepted")}
          size="default"
        >
          Accept
        </Button>

        <Button
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200"
          onClick={() => handleDispatch("declined")}
          size="default"
        >
          Decline
        </Button>
       
      </div>
    </div>
  );
}
