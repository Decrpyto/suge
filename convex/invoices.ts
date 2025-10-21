/**
 * Convex backend functions for Invoice Management
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// ============================================
// CREATE INVOICE
// ============================================
export const createInvoice = mutation({
    args: {
        clientId: v.id("clients"),
        invoiceNumber: v.string(),
        title: v.string(),
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
        taxType: v.union(
            v.literal("vat"),
            v.literal("gst"),
            v.literal("sales_tax"),
            v.literal("none"),
            v.literal("custom")
        ),
        taxRate: v.number(),
        taxMode: v.union(v.literal("exclusive"), v.literal("inclusive")),
        reverseCharge: v.optional(v.boolean()),
        withholdingTax: v.optional(v.number()),
        customTaxLabel: v.optional(v.string()),
        gstBreakdown: v.optional(
            v.object({
                cgst: v.optional(v.number()),
                sgst: v.optional(v.number()),
                igst: v.optional(v.number()),
            })
        ),
        subtotal: v.number(),
        totalDiscount: v.number(),
        totalTax: v.number(),
        totalAmount: v.number(),
        currency: v.string(),
        notes: v.optional(v.string()),
        terms: v.optional(v.string()),
        attachments: v.optional(v.array(v.string())),
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("paid"),
            v.literal("overdue"),
            v.literal("cancelled")
        ),
        issuedOn: v.string(),
        dueOn: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // Get user from Clerk ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // Verify client belongs to user
        const client = await ctx.db.get(args.clientId);
        if (!client || client.userId !== user._id) {
            throw new Error("Client not found or unauthorized");
        }

        // Create invoice
        const invoiceId = await ctx.db.insert("invoices", {
            userId: user._id,
            clientId: args.clientId,
            invoiceNumber: args.invoiceNumber,
            title: args.title,
            items: args.items,
            taxType: args.taxType,
            taxRate: args.taxRate,
            taxMode: args.taxMode,
            reverseCharge: args.reverseCharge,
            withholdingTax: args.withholdingTax,
            customTaxLabel: args.customTaxLabel,
            gstBreakdown: args.gstBreakdown,
            subtotal: args.subtotal,
            totalDiscount: args.totalDiscount,
            totalTax: args.totalTax,
            totalAmount: args.totalAmount,
            currency: args.currency,
            notes: args.notes,
            terms: args.terms,
            attachments: args.attachments,
            status: args.status,
            issuedOn: args.issuedOn,
            dueOn: args.dueOn,
            createdAt: Date.now(),
        });

        return invoiceId;
    },
});

// ============================================
// UPDATE INVOICE
// ============================================
export const updateInvoice = mutation({
    args: {
        invoiceId: v.id("invoices"),
        title: v.optional(v.string()),
        items: v.optional(
            v.array(
                v.object({
                    id: v.string(),
                    description: v.string(),
                    quantity: v.number(),
                    unitPrice: v.number(),
                    discount: v.optional(v.number()),
                    taxRate: v.optional(v.number()),
                })
            )
        ),
        taxType: v.optional(
            v.union(
                v.literal("vat"),
                v.literal("gst"),
                v.literal("sales_tax"),
                v.literal("none"),
                v.literal("custom")
            )
        ),
        taxRate: v.optional(v.number()),
        taxMode: v.optional(v.union(v.literal("exclusive"), v.literal("inclusive"))),
        reverseCharge: v.optional(v.boolean()),
        withholdingTax: v.optional(v.number()),
        customTaxLabel: v.optional(v.string()),
        gstBreakdown: v.optional(
            v.object({
                cgst: v.optional(v.number()),
                sgst: v.optional(v.number()),
                igst: v.optional(v.number()),
            })
        ),
        subtotal: v.optional(v.number()),
        totalDiscount: v.optional(v.number()),
        totalTax: v.optional(v.number()),
        totalAmount: v.optional(v.number()),
        currency: v.optional(v.string()),
        notes: v.optional(v.string()),
        terms: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("draft"),
                v.literal("sent"),
                v.literal("paid"),
                v.literal("overdue"),
                v.literal("cancelled")
            )
        ),
        dueOn: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // Get invoice and verify ownership
        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice || invoice.userId !== user._id) {
            throw new Error("Invoice not found or unauthorized");
        }

        // Update invoice
        const { invoiceId, ...updates } = args;
        await ctx.db.patch(args.invoiceId, {
            ...updates,
            updatedAt: Date.now(),
        });

        return args.invoiceId;
    },
});

// ============================================
// MARK INVOICE AS PAID (Auto-create Payment)
// ============================================
export const markInvoicePaid = mutation({
    args: {
        invoiceId: v.id("invoices"),
        paidOn: v.string(),
        paymentMethod: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        // Get invoice and verify ownership
        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice || invoice.userId !== user._id) {
            throw new Error("Invoice not found or unauthorized");
        }

        // Update invoice status
        await ctx.db.patch(args.invoiceId, {
            status: "paid",
            paidOn: args.paidOn,
            updatedAt: Date.now(),
        });

        // Create payment/earning record
        const earningId = await ctx.db.insert("earnings", {
            userId: user._id,
            clientId: invoice.clientId,
            amount: invoice.totalAmount,
            currency: invoice.currency,
            type: "income",
            category: "Invoice Payment",
            paymentMethod: args.paymentMethod || "Bank Transfer",
            notes: args.notes || `Payment for ${invoice.invoiceNumber}`,
            invoiceId: args.invoiceId,
            createdAt: Date.now(),
        });

        return { invoiceId: args.invoiceId, earningId };
    },
});

// ============================================
// GET INVOICE BY ID
// ============================================
export const getInvoice = query({
    args: { invoiceId: v.id("invoices") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            return null;
        }

        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice || invoice.userId !== user._id) {
            return null;
        }

        // Get client details
        const client = await ctx.db.get(invoice.clientId);

        return {
            ...invoice,
            client,
        };
    },
});

// ============================================
// LIST INVOICES
// ============================================
export const listInvoices = query({
    args: {
        status: v.optional(
            v.union(
                v.literal("draft"),
                v.literal("sent"),
                v.literal("paid"),
                v.literal("overdue"),
                v.literal("cancelled")
            )
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            return [];
        }

        let invoicesQuery = ctx.db
            .query("invoices")
            .withIndex("by_user", (q) => q.eq("userId", user._id));

        const invoices = await invoicesQuery.collect();

        // Filter by status if provided
        const filteredInvoices = args.status
            ? invoices.filter((inv) => inv.status === args.status)
            : invoices;

        // Get client details for each invoice
        const invoicesWithClients = await Promise.all(
            filteredInvoices.map(async (invoice) => {
                const client = await ctx.db.get(invoice.clientId);
                return {
                    ...invoice,
                    client,
                };
            })
        );

        return invoicesWithClients;
    },
});

// ============================================
// SEARCH INVOICES
// ============================================
export const searchInvoices = query({
    args: { searchQuery: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            return [];
        }

        // Search by title
        const titleResults = await ctx.db
            .query("invoices")
            .withSearchIndex("search_by_title", (q) =>
                q.search("title", args.searchQuery)
            )
            .collect();

        // Search by invoice number
        const numberResults = await ctx.db
            .query("invoices")
            .withSearchIndex("search_by_number", (q) =>
                q.search("invoiceNumber", args.searchQuery)
            )
            .collect();

        // Combine and deduplicate results
        const allResults = [...titleResults, ...numberResults];
        const uniqueResults = Array.from(
            new Map(allResults.map((inv) => [inv._id, inv])).values()
        );

        // Filter by user and get client details
        const userInvoices = uniqueResults.filter((inv) => inv.userId === user._id);

        const invoicesWithClients = await Promise.all(
            userInvoices.map(async (invoice) => {
                const client = await ctx.db.get(invoice.clientId);
                return {
                    ...invoice,
                    client,
                };
            })
        );

        return invoicesWithClients;
    },
});

// ============================================
// DELETE INVOICE
// ============================================
export const deleteInvoice = mutation({
    args: { invoiceId: v.id("invoices") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice || invoice.userId !== user._id) {
            throw new Error("Invoice not found or unauthorized");
        }

        // Only allow deletion of draft invoices
        if (invoice.status !== "draft") {
            throw new Error("Can only delete draft invoices");
        }

        await ctx.db.delete(args.invoiceId);
        return { success: true };
    },
});

// ============================================
// GET INVOICE STATS
// ============================================
export const getInvoiceStats = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            return null;
        }

        const invoices = await ctx.db
            .query("invoices")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        const stats = {
            total: invoices.length,
            draft: invoices.filter((inv) => inv.status === "draft").length,
            sent: invoices.filter((inv) => inv.status === "sent").length,
            paid: invoices.filter((inv) => inv.status === "paid").length,
            overdue: invoices.filter((inv) => inv.status === "overdue").length,
            totalRevenue: invoices
                .filter((inv) => inv.status === "paid")
                .reduce((sum, inv) => sum + inv.totalAmount, 0),
            pendingRevenue: invoices
                .filter((inv) => inv.status === "sent" || inv.status === "overdue")
                .reduce((sum, inv) => sum + inv.totalAmount, 0),
        };

        return stats;
    },
});
