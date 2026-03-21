import { useNavigate, useParams, Link } from "react-router-dom";
import apiClient from "@/services/api";
import { useToast } from "@/components/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@/validations/user.validation";
import { KeyRound, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import jobIcon from "@/assets/searchjob.png";

export const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { password: "", repeat_password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await apiClient.post(`/api/auth/reset-password/${id}/${token}`, {
        password: data.password,
      });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast({ title: err?.response?.data?.message || "Failed to reset password", variant: "destructive" });
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

          {!done ? (
            <>
              {/* Header */}
              <div className="text-center mb-7">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                    <KeyRound size={16} className="text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">Reset your password</h1>
                <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter new password"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      {...register("repeat_password")}
                      placeholder="Confirm new password"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {errors.repeat_password && <p className="text-xs text-red-500">{errors.repeat_password.message}</p>}
                </div>

                {/* Password requirements */}
                <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Password requirements:</p>
                  {[
                    "At least 8 characters",
                    "One uppercase letter",
                    "One number",
                    "One special character (@$!%*?&)"
                  ].map((req) => (
                    <p key={req} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" /> {req}
                    </p>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Remember your password?{" "}
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
              <h2 className="text-xl font-extrabold text-slate-900">Password Reset!</h2>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Your password has been reset successfully. Redirecting to sign in...
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={14} /> Go to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};