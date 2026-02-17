
import { useEffect,useState,useRef } from "react"
import apiClient from "@/services/api"
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
export const MagicLinkPageValidation = ()=>
{

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    verifyEmail(token);
  }, []);

  const verifyEmail = async (token) => {
    try {
      const res = await apiClient.get(
        `/api/auth/verify-email?token=${token}`
      );

      setStatus("success");
      setMessage(res.data.message || "Email verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setStatus("error");
      setMessage(
        err.message || "Verification failed or link expired"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      <div className="bg-white p-8 shadow-md rounded-xl w-full max-w-md space-y-4 text-center">

        {/* Icon + Title */}
        <div className="flex flex-col items-center space-y-2">

          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
              <h2 className="text-xl font-bold">
                Verifying your email…
              </h2>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500" />
              <h2 className="text-xl font-bold text-green-600">
                Email Verified
              </h2>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 text-red-500" />
              <h2 className="text-xl font-bold text-red-600">
                Verification Failed
              </h2>
            </>
          )}

        </div>

        {/* Message */}
        <p className="text-gray-600">
          {status === "loading" &&
            "Please wait while we verify your email address."}

          {status !== "loading" && message}
        </p>

        {/* Actions */}
        {status === "success" && (
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go to Login
          </button>
        )}

        {status === "error" && (
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Back to Register
          </button>
        )}

        {/* Footer icon */}
        <div className="flex justify-center pt-2">
          <Mail className="w-5 h-5 text-gray-400" />
        </div>

      </div>
    </div>
  )
}
