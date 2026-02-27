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

export const Login = () => {
  const navigate = useNavigate();
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
      navigate("/jobseeker/applications");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />
      <div className="flex justify-center items-center h-[80vh]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-2xl p-8 w-[350px] flex flex-col gap-4 relative"
          >
            <h2 className="text-xl font-bold text-center mb-4">Login</h2>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-muted-foreground"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <FormMessage />
                </FormItem>
               
              )}
            />
            
              
              <Link
                to="/forgot-password"
                className="ml-1 text-[#7337FF] hover:underline"
              >
                forget password
              </Link>
         

            {/* Register link */}
            <div className="text-sm text-center mb-2">
              Don't have an account?
              <Link
                to="/register"
                className="ml-1 text-[#7337FF] hover:underline"
              >
                Sign up
              </Link>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="bg-sky-700 text-white py-2 rounded-lg hover:bg-sky-800 transition">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};