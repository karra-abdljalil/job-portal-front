import { useState } from "react";
import apiClient from "@/services/api";

const ROLES = {
  JOB_SEEKER: "job_seeker",
  EMPLOYER: "employer",
};

export const Register = () => {
  const [role, setRole] = useState(ROLES.JOB_SEEKER);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",

    // Employer fields
    company_name: "",
    description: "",
    industry: "",
    location: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Handle inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Common fields
      data.append("full_name", form.full_name);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("role", role);

      // Role-based fields
      if (role === ROLES.JOB_SEEKER && cvFile) {
        data.append("cv_file", cvFile);
      }

      if (role === ROLES.EMPLOYER) {
        data.append("company_name", form.company_name);
        data.append("description", form.description);
        data.append("industry", form.industry);
        data.append("location", form.location);

        if (logoFile) {
          data.append("logo", logoFile);
        }
      }

      const res = await apiClient.post(
        "/api/auth/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Register error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Register
        </h2>

        {/* Role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value={ROLES.JOB_SEEKER}>
            Job Seeker
          </option>
          <option value={ROLES.EMPLOYER}>
            Employer
          </option>
        </select>

        {/* Common fields */}
        <input
          type="text"
          name="full_name"
          placeholder="Full name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* JOB SEEKER */}
        {role === ROLES.JOB_SEEKER && (
          <div>
            <label className="text-sm">
              Upload CV
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setCvFile(e.target.files[0])
              }
              className="w-full"
            />
          </div>
        )}

        {/* EMPLOYER */}
        {role === ROLES.EMPLOYER && (
          <>
            <input
              type="text"
              name="company_name"
              placeholder="Company name"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="industry"
              placeholder="Industry"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <textarea
              name="description"
              placeholder="Company description"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <div>
              <label className="text-sm">
                Company Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setLogoFile(e.target.files[0])
                }
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-sky-600 text-white p-2 rounded hover:bg-sky-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

