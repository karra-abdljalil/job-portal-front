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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import apiClient from "@/services/api";
import { Link, useSearchParams } from "react-router-dom";
import { EMPLOYER, JOB_SEEKER } from "@/constants/userRole";

export const Register = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      repeat_password: "",
      role,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiClient.post("/api/auth/register", data);

      toast({
        title: "Account Created Successfully ",
        description: "Check your email to verify.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border bg-white">
        {role === JOB_SEEKER && (
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Your Future Starts Here
            </CardTitle>
            <CardDescription>
              Showcase your experience and get discovered by companies hiring
              today.
            </CardDescription>
          </CardHeader>
        )}

        {role === EMPLOYER && (
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Build Your Dream Team{" "}
            </CardTitle>
            <CardDescription>
              Access a pool of skilled candidates and scale your company
              efficiently.{" "}
            </CardDescription>
          </CardHeader>
        )}

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Jhon"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="emailuser@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="repeat_password">Confirm Password</Label>
              <Input
                id="repeat_password"
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                {...register("repeat_password")}
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className="absolute right-3 top-9 text-muted-foreground"
              >
                {showRepeatPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              {errors.repeat_password && (
                <p className="text-sm text-red-500">
                  {errors.repeat_password.message}
                </p>
              )}
            </div>

            {/* Login */}
            <div className="text-sm text-center text-gray-600">
              Already have an account?
              <Link
                to="/login"
                className="ml-1 font-medium text-blue-500 hover:underline"
              >
                Sign in
              </Link>
            </div>

            {/* Submit */}
            <Button type="submit" className="bg-sky-700 text-white py-2 rounded-lg hover:bg-sky-800 " disabled={loading} >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
