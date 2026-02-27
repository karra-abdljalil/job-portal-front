import { AuthHeader } from "@/components/common/Headers/AuthHeader";
import { useNavigate, useParams, Link } from "react-router-dom";
import apiClient from "@/services/api";
import jobIcon from "@/assets/job.png";
import { useToast } from "@/components/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@/validations/user.validation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await apiClient.post(`/api/auth/reset-password/${id}/${token}`, {
        password: data.password,
      });
      toast({ title: res.data.message || "Password reset successfully" });

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast({ title: err?.response?.data?.message || "Failed to reset password" });
    }
  };

  return (
    <>
      <AuthHeader />
      <div className="flex justify-center items-center h-[80vh]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-2xl p-8 w-[350px] flex flex-col gap-4"
        >

          <h2 className="text-xl font-bold text-center">Reset Password</h2>

          {/* New Password */}
          <div className="w-full my-2">
            <Label htmlFor="password" className="form-label">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              {...register("password")}
              className="border p-2 rounded-lg w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-full my-2">
            <Label htmlFor="confirmPassword" className="form-label">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className="border p-2 rounded-lg w-full"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Back to login */}
          <div className="text-sm mb-2 text-center">
            Remember your password?{" "}
            <Link
              to="/login"
              className="cursor-pointer text-[#228CE0] hover:underline px-2"
            >
              Login
            </Link>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-sky-700 text-white py-2 rounded-lg hover:bg-sky-800 transition"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </>
  );
};