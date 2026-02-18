import { AuthHeader } from "@/components/common/Headers/AuthHeader";
import { useState } from "react";
import apiClient from "@/services/api";
import { Link } from "react-router-dom";
import jobIcon from "@/assets/job.png";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
    const handleLogin = async (e) => {
      e.preventDefault(); // prevent refresh
      setLoading(true);
      setError(null);

    apiClient.post("/api/auth/login", form)
    .then((res) => {
      navigate("/apps");
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });

}

  return (
    <>
      <AuthHeader />

      <div className="flex justify-center items-center h-[80vh]">
        
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-2xl p-8 w-[350px] flex flex-col gap-2"
        >
        <img
          src={jobIcon}
          alt="JobPortal logo"
          className="h-10 w-10 object-contain text-blue-700 self-center"
        />
          <h2 className="text-xl font-bold text-center ">Login</h2>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Email */}
          <div className="w-full my-2">
            <label htmlFor="email" className="form-label">email</label>
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
          

          {/* Password */}
          {/* forgot password links  */}
          <div className="w-full">
            <div className="flex justify-between">
                <label htmlFor="passowrd" className="form-label block">passowrd</label>

                <Link to={"/forgot-password"}
            className="ml-2 cursor-pointer text-xs text-[#228CE0] hover:underline block"
            >Forget Password?</Link>
            </div>
            <input
            id='password'
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full"
          />
            

          </div>

          
          
          <div className="text-sm mb-2">
            Don&#x27;t have an account?
          <Link to={"/register"} className="cursor-pointer text-[#7337FF] hover:underline px-2 "
            >Sign up</Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-700 text-white py-2 rounded-lg hover:bg-sky-800 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};
