import { AuthHeader } from "@/components/common/Headers/AuthHeader";
import { useState } from "react";
import apiClient from "@/services/api";
import { Link } from "react-router-dom";
import { useToast } from "@/components/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const ForgotPassword = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  // Handle submit
  const handleForgotPassword = async (data) => {
    setLoading(true);

    try {
      await apiClient.post("/api/auth/forgot-password", data);
      toast({ title: "Check your email to verify" });
    } catch (err) {
      toast({ title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />

      <div className="flex justify-center items-center h-[80vh]">
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="bg-white shadow-lg rounded-2xl p-8 w-[350px] flex flex-col gap-4"
        >
          <h2 className="text-xl font-bold text-center">Forgot Password</h2>

          {/* Email */}
          <div className="w-full my-2">
            <Label htmlFor="email" className="block mb-1 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="border p-2 rounded-lg w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Back to login */}
          <div className="text-sm mb-2 text-center">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-[#228CE0] hover:underline px-2"
            >
              Login
            </Link>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={loading}
            className="bg-sky-700 text-white py-2 rounded-lg hover:bg-sky-800 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </>
  );
};