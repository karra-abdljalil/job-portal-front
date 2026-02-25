import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/validations/user.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import apiClient from "@/services/api";
import { Link, useSearchParams } from "react-router-dom";

export const Register = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { full_name: "", email: "", password: "", repeat_password: "", role },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      const res = await apiClient.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res.data.message);
    } catch (err) {
      console.error(err);
      console.log(err.response?.data?.message || "Register error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 shadow-md rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Register</h2>

        {/* Full Name */}
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" {...register("full_name")} />
          {errors.full_name && (
            <span className="text-red-500 text-sm">{errors.full_name.message}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        {/* Repeat Password */}
        <div>
          <Label htmlFor="repeat_password">Repeat Password</Label>
          <Input id="repeat_password" type="password" {...register("repeat_password")} />
          {errors.repeat_password && (
            <span className="text-red-500 text-sm">{errors.repeat_password.message}</span>
          )}
        </div>

        {/* Login Link */}
        <div className="text-sm mb-2">
          Already have an account?
          <Link to="/login" className="cursor-pointer text-[#7337FF] hover:underline px-2">
            Login
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};