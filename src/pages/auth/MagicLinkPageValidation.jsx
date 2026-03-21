import { useEffect, useState, useRef } from "react";
import apiClient from "@/services/api";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import jobIcon from "@/assets/searchjob.png";

export const MagicLinkPageValidation = () => {
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
      const res = await apiClient.get(`/api/auth/verify-email?token=${token}`);
      setStatus("success");
      setMessage(res.data.message || "Email verified successfully");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Verification failed or link expired");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-100 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <img src={jobIcon} alt="logo" className="h-5 w-5 object-contain brightness-0 invert" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              Job<span className="text-blue-600">Portal</span>
            </span>
          </Link>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 w-full max-w-md text-center">

          {/* ── Loading ── */}
          {status === "loading" && (
            <div className="space-y-5">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                <Loader2 size={32} className="text-blue-500 animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Verifying your email...</h2>
                <p className="text-sm text-slate-400 mt-2">
                  Please wait while we verify your email address.
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          )}

          {/* ── Success ── */}
          {status === "success" && (
            <div className="space-y-5">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Email Verified!</h2>
                <p className="text-sm text-slate-400 mt-2">{message}</p>
                <p className="text-xs text-slate-300 mt-1">Redirecting to sign in...</p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Go to Sign In <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* ── Error ── */}
          {status === "error" && (
            <div className="space-y-5">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                <XCircle size={32} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Verification Failed</h2>
                <p className="text-sm text-slate-400 mt-2">{message}</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-3 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                >
                  Back to Register
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-100">
            <Mail size={13} className="text-slate-300" />
            <p className="text-xs text-slate-300">Email verification by JobPortal</p>
          </div>
        </div>
      </div>
    </div>
  );
};