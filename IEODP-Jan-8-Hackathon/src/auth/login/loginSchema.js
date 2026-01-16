// ----------------------
// ZOD SCHEMA

import z from "zod";
import { ROLES } from "../../utils/roles";

// ----------------------
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum([
        ROLES.OPERATIONS,
        ROLES.MANAGEMENT,
        ROLES.LEADERSHIP,
        ROLES.AUDITORS,
        ROLES.ADMIN
        
    ], {
        required_error: "Role is required",
    }),
});