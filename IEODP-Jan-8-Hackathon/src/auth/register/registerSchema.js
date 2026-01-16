// ----------------------
// ZOD SCHEMA

import z from "zod";

// ----------------------
export const registerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    mobileNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
        required_error: "Gender is required",
    }),
});