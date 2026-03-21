import { AuthHeader } from "@/components/common/Headers/AuthHeader";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "@/services/api";
import { loginSchema } from "@/validations/user.validation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { checkIfAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post("/api/auth/login", data);

      // 🔥 récupérer user directement
      const user = await checkIfAuthenticated();

      // 🔥 redirection selon rôle
      if (user?.role === "employer") {
        navigate("/employer/dashboard");
      } else if (user?.role === "job_seeker") {
        navigate("/jobseeker/applications");
      } else if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
   } catch (err) {
  console.log("LOGIN ERROR FULL =", err);
  console.log("LOGIN ERROR RESPONSE =", err?.response);

  setError(
    err?.response?.data?.message ||
    err?.message ||
    "Login failed"
  );
} finally {
      setIsLoading(false);
    }
  };

 return (
  <>
    <AuthHeader />

    <div className="relative flex min-h-[90vh] items-center justify-center bg-[#f3f2ef] px-4">
      
      {/* Background design */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(10,102,194,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(10,102,194,0.08),_transparent_30%)]" />
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-100 blur-3xl opacity-70" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur flex flex-col gap-5"
        >
          
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-500">
              Welcome back, please enter your credentials
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-800">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="h-12 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0a66c2]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-sm font-semibold text-slate-800">
                  Password
                </FormLabel>

                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className="h-12 rounded-xl pr-12 border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0a66c2]/20"
                  />
                </FormControl>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-slate-500 hover:text-[#0a66c2]"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot password */}
          <Link
            to="/forgot-password"
            className="text-sm text-[#0a66c2] hover:underline text-right"
          >
            Forgot password?
          </Link>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182] transition"
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </Button>

          {/* Register */}
          <div className="text-sm text-center text-slate-600">
            Don’t have an account?
            <Link
              to="/register"
              className="ml-1 font-semibold text-[#0a66c2] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  </>
);
};