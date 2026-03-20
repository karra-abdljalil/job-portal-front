import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/validations/user.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/hooks/use-toast";
import { Eye, EyeOff, Briefcase, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/services/api";
import { Link, useNavigate } from "react-router-dom";
import { EMPLOYER, JOB_SEEKER } from "@/constants/userRole";

export const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(EMPLOYER);
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
      role: EMPLOYER,
    },
  });

  useEffect(() => {
    setValue("role", selectedRole, { shouldValidate: true });
  }, [selectedRole, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      console.log("REGISTER PAYLOAD =", data);
const res = await apiClient.post("/api/auth/register", data);

toast({
  title: "Account Created Successfully",
  description: res?.magicLink
    ? "Use the verification link returned by the backend."
    : "Check your email to verify your account.",
});

if (res?.magicLink) {
  console.log("VERIFY LINK =", res.magicLink);
}

      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR =", err);

      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          err?.message ||
          err?.errors?.join(", ") ||
          "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentRole = watch("role");

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Top bar LinkedIn style */}
      <div className="w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0a66c2] text-white text-2xl font-bold shadow-sm">
            JP
            </div>
            <span className="hidden text-sm font-medium text-slate-600 sm:block">
              Join our professional network
            </span>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <Link
              to="/login"
              className="font-medium text-slate-700 transition hover:text-[#0a66c2]"
            >
              Sign in
            </Link>
            <span className="hidden h-5 w-px bg-slate-300 sm:block" />
            <span className="hidden text-slate-500 sm:block">
              For Employers
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden px-4 py-10">
        {/* background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(10,102,194,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(10,102,194,0.08),_transparent_30%)]" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-100 blur-3xl opacity-70" />

        <Card className="relative z-10 w-full max-w-xl rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
          <CardHeader className="space-y-3 pb-6 pt-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f3ff] shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a66c2] text-white text-xl font-bold">
                job 
              </div>
            </div>

            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Join the platform and start your professional journey
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* hidden input RHF */}
              <input type="hidden" {...register("role")} />

              {/* Role selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-800">
                  Role
                </Label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`cursor-pointer rounded-xl border px-4 py-3 transition-all ${
                        selectedRole === EMPLOYER
                          ? "border-[#0a66c2] bg-white text-[#0a66c2] shadow-sm"
                          : "border-transparent bg-transparent text-slate-600 hover:bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role-selector"
                        checked={selectedRole === EMPLOYER}
                        onChange={() => setSelectedRole(EMPLOYER)}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2 font-semibold">
                        <Briefcase size={18} />
                        Employer
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer rounded-xl border px-4 py-3 transition-all ${
                        selectedRole === JOB_SEEKER
                          ? "border-[#0a66c2] bg-white text-[#0a66c2] shadow-sm"
                          : "border-transparent bg-transparent text-slate-600 hover:bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role-selector"
                        checked={selectedRole === JOB_SEEKER}
                        onChange={() => setSelectedRole(JOB_SEEKER)}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2 font-semibold">
                        <UserRound size={18} />
                        Job Seeker
                      </div>
                    </label>
                  </div>
                </div>

                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>

              {/* Full name */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-800">
                  Full Name
                </Label>
                <Input
                  {...register("full_name")}
                  className="h-12 rounded-xl border-slate-300 bg-white shadow-none transition focus-visible:ring-2 focus-visible:ring-[#0a66c2]/20"
                  placeholder="Enter your full name"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-800">
                  Email
                </Label>
                <Input
                  type="email"
                  {...register("email")}
                  className="h-12 rounded-xl border-slate-300 bg-white shadow-none transition focus-visible:ring-2 focus-visible:ring-[#0a66c2]/20"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-800">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="h-12 rounded-xl border-slate-300 bg-white pr-12 shadow-none transition focus-visible:ring-2 focus-visible:ring-[#0a66c2]/20"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-[#0a66c2]"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-800">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    type={showRepeatPassword ? "text" : "password"}
                    {...register("repeat_password")}
                    className="h-12 rounded-xl border-slate-300 bg-white pr-12 shadow-none transition focus-visible:ring-2 focus-visible:ring-[#0a66c2]/20"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowRepeatPassword(!showRepeatPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-[#0a66c2]"
                  >
                    {showRepeatPassword ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>
                {errors.repeat_password && (
                  <p className="text-sm text-red-500">
                    {errors.repeat_password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-full bg-[#0a66c2] text-base font-semibold text-white shadow-md transition hover:bg-[#004182]"
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>

              {/* Login link */}
              <div className="text-center text-sm text-slate-600">
                Already have an account?
                <Link
                  to="/login"
                  className="ml-1 font-semibold text-[#0a66c2] hover:underline"
                >
                  Login
                </Link>
              </div>

              {/* Current selected role */}
              <p className="text-center text-xs text-slate-400">
                Selected role: {currentRole}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};