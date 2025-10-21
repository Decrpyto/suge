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
        invoiceNumber: v.string(), // SUGE-YYYYMM-0001
        title: v.string(),
        
        // Line items
        items: v.array(
            v.object({
                id: v.string(),
                description: v.string(),
                quantity: v.number(),
                unitPrice: v.number(),
                discount: v.optional(v.number()),
                taxRate: v.optional(v.number()),
            })
        ),
        
        // Tax configuration
        taxType: v.union(
            v.literal("vat"),
            v.literal("gst"),
            v.literal("sales_tax"),
            v.literal("none"),
            v.literal("custom")
        ),
        taxRate: v.number(), // Default tax rate
        taxMode: v.union(v.literal("exclusive"), v.literal("inclusive")),
        reverseCharge: v.optional(v.boolean()),
        withholdingTax: v.optional(v.number()),
        customTaxLabel: v.optional(v.string()),
        
        // GST breakdown (India)
        gstBreakdown: v.optional(
            v.object({
                cgst: v.optional(v.number()),
                sgst: v.optional(v.number()),
                igst: v.optional(v.number()),
            })
        ),
        
        // Calculated totals
        subtotal: v.number(),
        totalDiscount: v.number(),
        totalTax: v.number(),
        totalAmount: v.number(), // Grand total
        currency: v.string(),
        
        // Additional fields
        notes: v.optional(v.string()),
        terms: v.optional(v.string()),
        attachments: v.optional(v.array(v.string())),
        
        // Status and dates
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("paid"),
            v.literal("overdue"),
            v.literal("cancelled")
        ),
        issuedOn: v.string(), // invoice creation date
        dueOn: v.string(), // payment due date
        paidOn: v.optional(v.string()), // payment received date
        
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    })
        .index("by_user", ["userId"])
        .index("by_client", ["clientId"])
        .index("by_status", ["status"])
        .searchIndex("search_by_title", { searchField: "title" })
        .searchIndex("search_by_number", { searchField: "invoiceNumber" }),

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
