import { mutation } from "./_generated/server";
import { v } from "convex/values";

//This mutation creates or updates the user values.

export const createOrUpdateUserMutation = mutation({
    args: {
        clerkId: v.string(),
        fullName: v.string(),
        imageUrl: v.string(),
        bio: v.string(),
        role: v.string(),
        email: v.string(),
        experienceYears: v.number(),
        skills: v.array(v.string()),
        isAvailableForHire: v.boolean(),
        plan: v.string(),
        createdAt: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existing) {
            return await ctx.db.patch(existing._id, { ...args });
        }

        return await ctx.db.insert("users", args);
    },
});
