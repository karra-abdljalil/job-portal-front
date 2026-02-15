import { formatDate } from "../../utils/function";

export default function RejectedStatus({ application }) {
  return (
      <div className="text-center">
        <p className="text-lg font-semibold text-red-700">
          ❌ Unfortunately, your application was not selected.
        </p>
      </div>

  );
}
