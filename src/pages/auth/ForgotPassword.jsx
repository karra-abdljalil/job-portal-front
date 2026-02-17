import { AuthHeader } from "@/components/common/Headers/AuthHeader";
import { useState } from "react";
import apiClient from "@/services/api";
import { Link } from "react-router-dom";
import jobIcon from "@/assets/job.png";

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    email: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await apiClient.post("/api/auth/forgot-password", form);
      setMessage(res.data.message || "Reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />

      <div className="flex justify-center items-center h-[80vh]">
        <form
          onSubmit={handleForgotPassword}
          className="bg-white shadow-lg rounded-2xl p-8 w-[350px] flex flex-col gap-4"
        >
          <img
            src={jobIcon}
            alt="JobPortal logo"
            className="h-10 w-10 object-contain text-blue-700 self-center"
          />
          <h2 className="text-xl font-bold text-center">Forgot Password</h2>

          {message && (
            <p className="text-green-500 text-sm text-center">{message}</p>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Email */}
          <div className="w-full my-2">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg w-full"
            />
          </div>

          {/* Back to login */}
          <div className="text-sm mb-2 text-center">
            Remembered your password?{" "}
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
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </>
  );
};
