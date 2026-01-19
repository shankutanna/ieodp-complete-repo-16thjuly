import { z } from "zod";

export const raiseRequestSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 chars"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const leadershipCommentSchema = z.object({
    leadershipComment: z.string().min(5, "Comment required"),
});

export const managementActionSchema = z.object({
    managementAction: z.string().min(5, "Action is required"),
});

export const auditorDecisionSchema = z.object({
    auditorDecision: z.enum(["APPROVED", "REJECTED","REVERIFY"]),
});
