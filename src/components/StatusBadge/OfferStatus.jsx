import { Button } from "../ui/button";

export default function OfferStatus({ application }) {
  return (
    <div className=" flex justify-center items-center">
      <div className=" flex-1 text-left">
        <p className="text-md font-semibold text-green-700">
          🎉 Congratulations! You received an offer.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors duration-200"
          onClick={() => console.log("Accepted")}
          size='default'
        >
          Accept
        </Button>

        <Button
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200"
          onClick={() => console.log("Declined")}
          size='default'
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
