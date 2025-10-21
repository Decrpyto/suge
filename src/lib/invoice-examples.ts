/**
 * Example invoice calculations for different tax systems
 */

import { calculateInvoiceTotals, InvoiceInput } from "./invoice-calculator";

// ============================================
// EXAMPLE 1: EU VAT (Tax Exclusive)
// ============================================
export const euVatExample: InvoiceInput = {
    items: [
        {
            id: "1",
            description: "Website Design & Development",
            quantity: 1,
            unitPrice: 5000,
            discount: 10, // 10% discount
        },
        {
            id: "2",
            description: "Logo Design",
            quantity: 1,
            unitPrice: 1000,
        },
        {
            id: "3",
            description: "Monthly Maintenance (3 months)",
            quantity: 3,
            unitPrice: 500,
        },
    ],
    currency: "EUR",
    taxType: "vat",
    taxRate: 21, // 21% VAT (Netherlands/Belgium)
    taxMode: "exclusive",
};

console.log("=== EU VAT EXAMPLE (Tax Exclusive) ===");
console.log(JSON.stringify(calculateInvoiceTotals(euVatExample), null, 2));
/*
Expected Output:
{
  "subtotal": 7500.00,
  "totalDiscount": 500.00,
  "taxableAmount": 7000.00,
  "totalTax": 1470.00,
  "grandTotal": 8470.00,
  "totalInWords": "Eight Thousand Four Hundred Seventy EUR Only"
}
*/

// ============================================
// EXAMPLE 2: US Sales Tax (Tax Exclusive)
// ============================================
export const usSalesTaxExample: InvoiceInput = {
    items: [
        {
            id: "1",
            description: "Consulting Services - Q1 2025",
            quantity: 40,
            unitPrice: 150, // $150/hour
        },
        {
            id: "2",
            description: "Software License",
            quantity: 1,
            unitPrice: 500,
            discount: 20, // 20% discount
        },
    ],
    currency: "USD",
    taxType: "sales_tax",
    taxRate: 8.5, // California sales tax
    taxMode: "exclusive",
};

console.log("\n=== US SALES TAX EXAMPLE (Tax Exclusive) ===");
console.log(JSON.stringify(calculateInvoiceTotals(usSalesTaxExample), null, 2));
/*
Expected Output:
{
  "subtotal": 6500.00,
  "totalDiscount": 100.00,
  "taxableAmount": 6400.00,
  "totalTax": 544.00,
  "grandTotal": 6944.00,
  "totalInWords": "Six Thousand Nine Hundred Forty Four USD Only"
}
*/

// ============================================
// EXAMPLE 3: No Tax (Reverse Charge / International)
// ============================================
export const noTaxExample: InvoiceInput = {
    items: [
        {
            id: "1",
            description: "Mobile App Development",
            quantity: 1,
            unitPrice: 15000,
        },
        {
            id: "2",
            description: "API Integration",
            quantity: 1,
            unitPrice: 3000,
        },
    ],
    currency: "USD",
    taxType: "none",
    taxRate: 0,
    taxMode: "exclusive",
};

console.log("\n=== NO TAX EXAMPLE (International B2B) ===");
console.log(JSON.stringify(calculateInvoiceTotals(noTaxExample), null, 2));
/*
Expected Output:
{
  "subtotal": 18000.00,
  "totalDiscount": 0.00,
  "taxableAmount": 18000.00,
  "totalTax": 0.00,
  "grandTotal": 18000.00,
  "totalInWords": "Eighteen Thousand USD Only"
}
*/

// ============================================
// EXAMPLE 4: Indian GST with Breakdown (CGST + SGST)
// ============================================
export const indianGstExample: InvoiceInput = {
    items: [
        {
            id: "1",
            description: "E-commerce Platform Development",
            quantity: 1,
            unitPrice: 100000,
        },
        {
            id: "2",
            description: "Payment Gateway Integration",
            quantity: 1,
            unitPrice: 25000,
        },
    ],
    currency: "INR",
    taxType: "gst",
    taxRate: 18, // 18% GST
    taxMode: "exclusive",
    gstBreakdown: {
        cgst: 9, // Central GST 9%
        sgst: 9, // State GST 9%
    },
};

console.log("\n=== INDIAN GST EXAMPLE (CGST + SGST) ===");
console.log(JSON.stringify(calculateInvoiceTotals(indianGstExample), null, 2));
/*
Expected Output:
{
  "subtotal": 125000.00,
  "totalDiscount": 0.00,
  "taxableAmount": 125000.00,
  "totalTax": 22500.00,
  "grandTotal": 147500.00,
  "gstBreakdown": {
    "cgst": { "rate": 9, "amount": 11250.00 },
    "sgst": { "rate": 9, "amount": 11250.00 }
  }
}
*/

// ============================================
// EXAMPLE 5: Tax Inclusive Pricing (UK VAT)
// ============================================
export const ukVatInclusiveExample: InvoiceInput = {
    items: [
        {
            id: "1",
            description: "Graphic Design Package",
            quantity: 1,
            unitPrice: 1200, // Price includes VAT
        },
        {
            id: "2",
            description: "Brand Guidelines Document",
            quantity: 1,
            unitPrice: 600, // Price includes VAT
        },
    ],
    currency: "GBP",
    taxType: "vat",
    taxRate: 20, // 20% UK VAT
    taxMode: "inclusive",
};

console.log("\n=== UK VAT EXAMPLE (Tax Inclusive) ===");
console.log(JSON.stringify(calculateInvoiceTotals(ukVatInclusiveExample), null, 2));
/*
Expected Output:
{
  "subtotal": 1800.00,
  "totalDiscount": 0.00,
  "taxableAmount": 1800.00,
  "totalTax": 300.00, // Tax extracted from price
  "grandTotal": 1800.00,
  "totalInWords": "One Thousand Eight Hundred GBP Only"
}
*/

// ============================================
// EXAMPLE 6: Withholding Tax (TDS - India)
// ============================================
export const withholdingTaxExample: InvoiceInput = {
    items: [
        {
            id: "1",
            description: "Professional Services - March 2025",
            quantity: 1,
            unitPrice: 50000,
        },
    ],
    currency: "INR",
    taxType: "gst",
    taxRate: 18,
    taxMode: "exclusive",
    withholdingTax: 10, // 10% TDS deducted
    gstBreakdown: {
        cgst: 9,
        sgst: 9,
    },
};

console.log("\n=== WITHHOLDING TAX EXAMPLE (TDS) ===");
console.log(JSON.stringify(calculateInvoiceTotals(withholdingTaxExample), null, 2));
/*
Expected Output:
{
  "subtotal": 50000.00,
  "totalDiscount": 0.00,
  "taxableAmount": 50000.00,
  "totalTax": 9000.00,
  "withholdingTax": 5900.00, // 10% of (50000 + 9000)
  "grandTotal": 53100.00, // After TDS deduction
}
*/
