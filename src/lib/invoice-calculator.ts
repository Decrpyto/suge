/**
 * Global Invoice Tax Calculator
 * Supports: VAT (EU), GST (India), Sales Tax (US), and custom tax systems
 */

export type TaxType = "vat" | "gst" | "sales_tax" | "none" | "custom";
export type TaxMode = "exclusive" | "inclusive";

export interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number; // percentage 0-100
    taxRate?: number; // percentage 0-100 (overrides invoice-level if set)
}

export interface InvoiceInput {
    items: InvoiceLineItem[];
    currency: string;
    taxType: TaxType;
    taxRate: number; // default tax rate (0-100)
    taxMode: TaxMode; // exclusive or inclusive
    // Optional advanced tax fields
    reverseCharge?: boolean; // EU B2B VAT
    withholdingTax?: number; // TDS percentage (0-100)
    customTaxLabel?: string; // e.g., "Service Tax", "Luxury Tax"
    // GST-specific (India)
    gstBreakdown?: {
        cgst?: number;
        sgst?: number;
        igst?: number;
    };
}

export interface TaxBreakdown {
    subtotal: number;
    totalDiscount: number;
    taxableAmount: number;
    totalTax: number;
    withholdingTax?: number;
    grandTotal: number;
    totalInWords: string;
    // Detailed breakdown
    lineItems: Array<{
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        discount: number;
        discountedAmount: number;
        taxRate: number;
        taxAmount: number;
        lineGrandTotal: number;
    }>;
    // Tax-specific breakdowns
    taxBreakdown?: {
        label: string;
        rate: number;
        amount: number;
    }[];
    // GST breakdown (if applicable)
    gstBreakdown?: {
        cgst?: { rate: number; amount: number };
        sgst?: { rate: number; amount: number };
        igst?: { rate: number; amount: number };
    };
}

/**
 * Calculate invoice totals with global tax support
 */
export function calculateInvoiceTotals(
    invoice: InvoiceInput
): TaxBreakdown {
    const lineItemsBreakdown = invoice.items.map((item) => {
        const lineTotal = item.quantity * item.unitPrice;
        const discountPercent = item.discount || 0;
        const discountAmount = (lineTotal * discountPercent) / 100;
        const discountedAmount = lineTotal - discountAmount;

        // Use item-level tax rate if specified, otherwise use invoice-level
        const applicableTaxRate = item.taxRate ?? invoice.taxRate;

        let taxAmount = 0;
        let lineGrandTotal = 0;

        if (invoice.taxMode === "exclusive") {
            // Tax calculated on top of discounted amount
            taxAmount = (discountedAmount * applicableTaxRate) / 100;
            lineGrandTotal = discountedAmount + taxAmount;
        } else {
            // Tax is included in the price
            taxAmount = (discountedAmount * applicableTaxRate) / (100 + applicableTaxRate);
            lineGrandTotal = discountedAmount;
        }

        return {
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal,
            discount: discountAmount,
            discountedAmount,
            taxRate: applicableTaxRate,
            taxAmount,
            lineGrandTotal,
        };
    });

    // Calculate totals
    const subtotal = lineItemsBreakdown.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalDiscount = lineItemsBreakdown.reduce((sum, item) => sum + item.discount, 0);
    const taxableAmount = subtotal - totalDiscount;
    let totalTax = lineItemsBreakdown.reduce((sum, item) => sum + item.taxAmount, 0);

    // Handle reverse charge (no tax applied)
    if (invoice.reverseCharge) {
        totalTax = 0;
    }

    // Calculate grand total
    let grandTotal = invoice.taxMode === "exclusive" 
        ? taxableAmount + totalTax 
        : taxableAmount;

    // Apply withholding tax (TDS) if applicable
    let withholdingTaxAmount = 0;
    if (invoice.withholdingTax && invoice.withholdingTax > 0) {
        withholdingTaxAmount = (grandTotal * invoice.withholdingTax) / 100;
        grandTotal -= withholdingTaxAmount;
    }

    // Build tax breakdown
    const taxBreakdown: TaxBreakdown["taxBreakdown"] = [];
    
    if (!invoice.reverseCharge && invoice.taxType !== "none") {
        const taxLabel = invoice.customTaxLabel || getTaxLabel(invoice.taxType);
        taxBreakdown.push({
            label: taxLabel,
            rate: invoice.taxRate,
            amount: totalTax,
        });
    }

    // GST breakdown (India-specific)
    let gstBreakdown: TaxBreakdown["gstBreakdown"];
    if (invoice.taxType === "gst" && invoice.gstBreakdown) {
        const { cgst, sgst, igst } = invoice.gstBreakdown;
        gstBreakdown = {};
        
        if (cgst) {
            const cgstAmount = (taxableAmount * cgst) / 100;
            gstBreakdown.cgst = { rate: cgst, amount: cgstAmount };
        }
        if (sgst) {
            const sgstAmount = (taxableAmount * sgst) / 100;
            gstBreakdown.sgst = { rate: sgst, amount: sgstAmount };
        }
        if (igst) {
            const igstAmount = (taxableAmount * igst) / 100;
            gstBreakdown.igst = { rate: igst, amount: igstAmount };
        }

        // Recalculate total tax for GST
        const gstTotal = Object.values(gstBreakdown).reduce(
            (sum, tax) => sum + tax.amount,
            0
        );
        totalTax = gstTotal;
        grandTotal = invoice.taxMode === "exclusive" 
            ? taxableAmount + totalTax 
            : taxableAmount;
    }

    return {
        subtotal,
        totalDiscount,
        taxableAmount,
        totalTax,
        withholdingTax: withholdingTaxAmount,
        grandTotal,
        totalInWords: numberToWords(grandTotal, invoice.currency),
        lineItems: lineItemsBreakdown,
        taxBreakdown,
        gstBreakdown,
    };
}

/**
 * Get tax label based on tax type
 */
function getTaxLabel(taxType: TaxType): string {
    switch (taxType) {
        case "vat":
            return "VAT";
        case "gst":
            return "GST";
        case "sales_tax":
            return "Sales Tax";
        default:
            return "Tax";
    }
}

/**
 * Convert number to words (simplified version)
 * For production, use a library like 'number-to-words'
 */
function numberToWords(amount: number, currency: string): string {
    const ones = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Million", "Billion"];

    if (amount === 0) return `Zero ${currency}`;

    const [integerPart, decimalPart] = amount.toFixed(2).split(".");
    const num = parseInt(integerPart);

    function convertLessThanThousand(n: number): string {
        if (n === 0) return "";
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
        return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertLessThanThousand(n % 100) : "");
    }

    function convert(n: number): string {
        if (n === 0) return "";
        let result = "";
        let scaleIndex = 0;

        while (n > 0) {
            const chunk = n % 1000;
            if (chunk !== 0) {
                const chunkWords = convertLessThanThousand(chunk);
                result = chunkWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + (result ? " " + result : "");
            }
            n = Math.floor(n / 1000);
            scaleIndex++;
        }

        return result;
    }

    const words = convert(num);
    const cents = parseInt(decimalPart);
    
    if (cents > 0) {
        return `${words} ${currency} and ${cents}/100`;
    }
    
    return `${words} ${currency} Only`;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);
}

/**
 * Generate invoice number
 */
export function generateInvoiceNumber(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
    return `SUGE-${year}${month}-${random}`;
}
