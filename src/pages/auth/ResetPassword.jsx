import { AuthHeader } from "@/components/common/Headers/AuthHeader";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import apiClient from "@/services/api";
import jobIcon from "@/assets/job.png";

export const ResetPassword = () => {
  const { id, token } = useParams(); // get from URL /reset-password/:id/:token
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.post(
        `/api/auth/reset-password/${id}/${token}`,
        { password: form.password }
      );
      setMessage(res.data.message || "Password reset successfully");

      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);

    } catch (err) {
      setError(
        err.error[0]?.message ||
        "Failed to reset password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />
      <div className="flex justify-center items-center h-[80vh]">
        <form
          onSubmit={handleResetPassword}
          className="bg-white shadow-lg rounded-2xl p-8 w-[350px] flex flex-col gap-4"
        >
          <img
            src={jobIcon}
            alt="JobPortal logo"
            className="h-10 w-10 object-contain text-blue-700 self-center"
          />

          <h2 className="text-xl font-bold text-center">Reset Password</h2>

          {message && (
            <p className="text-green-500 text-sm text-center">{message}</p>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* New Password */}
          <div className="w-full my-2">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg w-full"
            />
          </div>

          {/* Confirm Password */}
          <div className="w-full my-2">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg w-full"
            />
          </div>

          {/* Back to login */}
          <div className="text-sm mb-2 text-center">
            Remember your password?{" "}
            <Link to={"/login"} className="cursor-pointer text-[#228CE0] hover:underline px-2">
              Login
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-700 text-white py-2 rounded-lg hover:bg-sky-800 transition"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </>
  );
};
