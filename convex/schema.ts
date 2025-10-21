import { defineSchema, defineTable, SearchFilter } from "convex/server";
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
        .index("by_createdAt", ["createdAt"])
        .searchIndex("search_by_name", { searchField: "fullName" }),

    // clients
    clients: defineTable({
        userId: v.id("users"),
        name: v.string(),
        email: v.string(),
        company: v.string(),
        phone: v.optional(v.number()),
        linkedInUser: v.optional(v.id("users")),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_linked_user", ["linkedInUser"]),

    //invoices
    invoices: defineTable({
        userId: v.id("users"), // Freelancer
        clientId: v.id("clients"), // Client this invoice is for
        title: v.string(),
        totalAmount: v.number(),
        currency: v.string(),
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("paid"),
            v.literal("overdue")
        ),

        issuedOn: v.string(), // invoice creation date
        dueOn: v.string(), // payment due date
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_client", ["clientId"])
        .searchIndex("search_by_title", { searchField: "title" }),

    // Earnings
    earnings: defineTable({
        userId: v.id("users"),
        clientId: v.id("clients"),
        amount: v.number(),
        currency: v.string(),
        type: v.union(v.literal("income"), v.literal("expense")),
        category: v.optional(v.string()),
        paymentMethod: v.optional(v.string()),
        notes: v.optional(v.string()),
        invoiceId: v.optional(v.id("invoices")),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    }),
});
