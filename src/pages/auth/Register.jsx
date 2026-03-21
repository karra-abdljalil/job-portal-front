import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/validations/user.validation";
import { useToast } from "@/components/hooks/use-toast";
import { Eye, EyeOff, Briefcase, UserRound, Check } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/services/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EMPLOYER, JOB_SEEKER } from "@/constants/userRole";
import jobIcon from "@/assets/searchjob.png";

export const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    searchParams.get("role") === "job_seeker" ? JOB_SEEKER : EMPLOYER
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      repeat_password: "",
      role: searchParams.get("role") === "job_seeker" ? JOB_SEEKER : EMPLOYER,
    },
  });

  useEffect(() => {
    setValue("role", selectedRole, { shouldValidate: true });
  }, [selectedRole, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await apiClient.post("/api/auth/register", data);
      toast({
        title: "Account Created Successfully",
        description: "Check your email to verify your account.",
      });
      navigate("/login");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err?.message || err?.errors?.join(", ") || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const BENEFITS_SEEKER = [
    "Apply to thousands of jobs",
    "Upload and manage your CVs",
    "Track your applications",
    "Get matched with top companies",
  ];

  const BENEFITS_EMPLOYER = [
    "Post unlimited job listings",
    "Browse candidate profiles",
    "Manage applications easily",
    "Build your company profile",
  ];

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
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* ── Left Panel ── */}
          <div className="hidden lg:block space-y-8">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
                {selectedRole === JOB_SEEKER ? "For Job Seekers" : "For Employers"}
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                {selectedRole === JOB_SEEKER
                  ? "Start your career journey today"
                  : "Find the perfect candidate"}
              </h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                {selectedRole === JOB_SEEKER
                  ? "Join thousands of professionals who found their dream jobs through our platform."
                  : "Connect with top talent and build your team with our powerful hiring tools."}
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {(selectedRole === JOB_SEEKER ? BENEFITS_SEEKER : BENEFITS_EMPLOYER).map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
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
                  {selectedRole === JOB_SEEKER
                    ? <UserRound size={16} className="text-white" />
                    : <Briefcase size={16} className="text-white" />
                  }
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
              <p className="text-sm text-slate-400 mt-1">Fill in the details below to get started</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("role")} />

              {/* Role Toggle */}
              <div className="bg-slate-50 rounded-2xl p-1.5 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole(EMPLOYER)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedRole === EMPLOYER
                      ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Briefcase size={15} /> Employer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole(JOB_SEEKER)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedRole === JOB_SEEKER
                      ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <UserRound size={15} /> Job Seeker
                </button>
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Full Name</label>
                <input
                  {...register("full_name")}
                  placeholder="Enter your full name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
                {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
              </div>

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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Password</label>
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showRepeatPassword ? "text" : "password"}
                    {...register("repeat_password")}
                    placeholder="Confirm your password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showRepeatPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {errors.repeat_password && <p className="text-xs text-red-500">{errors.repeat_password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm mt-2"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              {/* Login link */}
              <p className="text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};