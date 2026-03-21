import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import apiClient from "@/services/api";
import { useToast } from "@/components/hooks/use-toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import jobIcon from "@/assets/searchjob.png";

export const ForgotPassword = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "" },
  });

  const handleForgotPassword = async (data) => {
    setLoading(true);
    try {
      await apiClient.post("/api/auth/forgot-password", data);
      setSent(true);
    } catch (err) {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
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
          <Link to="/login" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 w-full max-w-md">

          {!sent ? (
            <>
              {/* Form Header */}
              <div className="text-center mb-7">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Mail size={16} className="text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">Forgot your password?</h1>
                <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Email</label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Enter your email"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Remembered your password?{" "}
                  <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            </>
          ) : (
            /* ── Success State ── */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Check your email!</h2>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                We've sent a password reset link to your email address. Please check your inbox.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};