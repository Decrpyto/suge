import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserByClerkId = query({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, { clerkId }) => {
        return await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", clerkId))
            .first();
    },
});

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

//This mutation updates the extendeded information.

export const updateUserProfile = mutation({
    args: {
        clerkId: v.string(),
        bio: v.optional(v.string()),
        role: v.optional(v.string()),
        experienceYears: v.optional(v.number()),
        skills: v.optional(v.array(v.string())),
        isAvailableForHire: v.optional(v.boolean()),
        plan: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!existing) throw new Error("User not found");

        return await ctx.db.patch(existing._id, {
            ...args,
        });
    },
});
