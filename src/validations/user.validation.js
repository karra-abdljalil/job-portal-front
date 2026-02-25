import { z } from "zod";
import { JOB_SEEKER, EMPLOYER } from "@/constants/userRole";
export  const RegisterSchema = z
  .object({
    full_name: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(50)
      .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters")
      .nonempty("Full name is required"),

    email: z
      .string()
      .email("Invalid email format")
      .transform((val) => val.toLowerCase().trim()),

    password: z
      .string()
      .min(8)
      .max(30)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number and special character",
      ),

    repeat_password: z.string().nonempty("Repeat password is required"),

    role: z.enum([JOB_SEEKER, EMPLOYER]),
  })
  .refine((data) => data.password === data.repeat_password, {
    message: "Passwords do not match",
    path: ["repeat_password"],
  });

