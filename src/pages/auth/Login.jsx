import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "@/services/api";
import { loginSchema } from "@/validations/user.validation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import jobIcon from "@/assets/searchjob.png";
import { Target, ClipboardList, Building2 } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const { checkIfAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post("/api/auth/login", data);
      const user = await checkIfAuthenticated();
      if (user?.role === "employer") navigate("/employer/dashboard");
      else if (user?.role === "job_seeker") navigate("/jobseeker/dashboard");
      else if (user?.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setIsLoading(false);
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
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* ── Left Panel ── */}
          <div className="hidden lg:block space-y-6">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Welcome Back</p>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Continue your professional journey
              </h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Sign in to access your dashboard, manage your applications and connect with top opportunities.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
  { icon: Target, title: "Smart Job Matching", desc: "Get matched with jobs that fit your profile" },
  { icon: ClipboardList, title: "Application Tracking", desc: "Follow all your applications in real-time" },
  { icon: Building2, title: "Top Companies", desc: "Connect with the best companies in your field" },
].map((item) => (
  <div key={item.title} className="flex items-start gap-3">
    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
      <item.icon size={18} className="text-blue-600" />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-800">{item.title}</p>
      <p className="text-xs text-slate-400">{item.desc}</p>
    </div>
  </div>
))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "10K+", label: "Jobs" },
                { val: "50K+", label: "Seekers" },
                { val: "2K+", label: "Companies" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
                  <p className="text-xl font-extrabold text-blue-600">{val}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel - Form ── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 w-full">

            {/* Form Header */}
            <div className="text-center mb-7">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <LogIn size={16} className="text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Sign in to your account</h1>
              <p className="text-sm text-slate-400 mt-1">Welcome back! Enter your credentials</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-2.5 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 font-semibold hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm mt-2"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              {/* Register link */}
              <p className="text-center text-xs text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};