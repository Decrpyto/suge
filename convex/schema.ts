import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const UserPlan = {
    Free: "Free",
    Pro: "Pro",
};

const userPlanValidator = v.union(
    v.literal(UserPlan.Free),
    v.literal(UserPlan.Pro)
);

export default defineSchema({
    users: defineTable({
        clerkId: v.string(), //clerkId,
        fullName: v.string(),
        imageUrl: v.string(),
        bio: v.string(),
        role: v.string(),
        email: v.string(),
        experienceYears: v.number(),
        skills: v.array(v.string()),
        isAvailableForHire: v.boolean(),
        plan: userPlanValidator,
        createdAt: v.number(),
    })
        .index("by_userId", ["clerkId"])
        .index("by_plan", ["plan"])
        .index("by_availability", ["isAvailableForHire"])
        .index("by_createdAt", ["createdAt"]),
});
