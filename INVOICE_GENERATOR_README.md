# Invoice Generator - Global-Ready Implementation Guide

## Overview

Complete, production-ready invoice generator for Suge with global tax support (VAT, GST, Sales Tax), PDF generation, and Convex backend integration.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install jspdf jspdf-autotable
npm install --save-dev @types/jspdf
```

### 2. Deploy Convex Schema

The updated schema in `convex/schema.ts` includes all invoice fields. Deploy it:

```bash
npx convex dev
```

### 3. Access the Invoice Generator

Navigate to `/invoice-generator` in your app.

---

## 📁 File Structure

```
src/
├── lib/
│   ├── invoice-calculator.ts      # Core tax calculation engine
│   ├── invoice-examples.ts        # Example calculations
│   └── pdf-generator.ts           # PDF generation utility
├── components/
│   ├── invoice-editor.tsx         # Main invoice editor UI
│   └── invoice-preview.tsx        # Invoice preview modal
└── app/(main)/
    └── invoice-generator/
        └── page.tsx               # Main page component

convex/
├── schema.ts                      # Updated with invoice schema
└── invoices.ts                    # Backend functions
```

---

## 🌍 Global Tax System

### Supported Tax Types

1. **VAT (EU)** - Value Added Tax
   - Single percentage (e.g., 21% Netherlands)
   - Tax-exclusive or tax-inclusive
   - Reverse charge support for B2B

2. **GST (India)** - Goods & Services Tax
   - CGST + SGST (intra-state)
   - IGST (inter-state)
   - TDS (withholding tax) support

3. **Sales Tax (US)** - State sales tax
   - Single percentage (e.g., 8.5% California)
   - Tax-exclusive

4. **Custom Tax** - Any custom tax label
   - Configurable rate and label

5. **No Tax** - International B2B, exempt transactions

### Tax Modes

- **Tax Exclusive**: Tax added on top of price
- **Tax Inclusive**: Tax included in price

---

## 💻 Usage Examples

### Example 1: EU VAT Invoice

```typescript
import { calculateInvoiceTotals } from "@/lib/invoice-calculator";

const invoice = {
    items: [
        {
            id: "1",
            description: "Website Development",
            quantity: 1,
            unitPrice: 5000,
            discount: 10, // 10% discount
        },
    ],
    currency: "EUR",
    taxType: "vat",
    taxRate: 21, // 21% VAT
    taxMode: "exclusive",
};

const totals = calculateInvoiceTotals(invoice);
// Result: €5,445 (€5,000 - €500 discount + €945 VAT)
```

### Example 2: Indian GST Invoice

```typescript
const invoice = {
    items: [
        {
            id: "1",
            description: "Consulting Services",
            quantity: 1,
            unitPrice: 100000,
        },
    ],
    currency: "INR",
    taxType: "gst",
    taxRate: 18,
    taxMode: "exclusive",
    gstBreakdown: {
        cgst: 9, // 9% CGST
        sgst: 9, // 9% SGST
    },
    withholdingTax: 10, // 10% TDS
};

const totals = calculateInvoiceTotals(invoice);
// Result: ₹106,200 (₹100,000 + ₹18,000 GST - ₹11,800 TDS)
```

### Example 3: US Sales Tax Invoice

```typescript
const invoice = {
    items: [
        {
            id: "1",
            description: "Software License",
            quantity: 1,
            unitPrice: 1000,
        },
    ],
    currency: "USD",
    taxType: "sales_tax",
    taxRate: 8.5, // California sales tax
    taxMode: "exclusive",
};

const totals = calculateInvoiceTotals(invoice);
// Result: $1,085 ($1,000 + $85 sales tax)
```

---

## 🔧 Convex Integration

### Create Invoice

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const createInvoice = useMutation(api.invoices.createInvoice);

// In your component
const handleSave = async (invoiceData) => {
    const invoiceId = await createInvoice(invoiceData);
    console.log("Invoice created:", invoiceId);
};
```

### List Invoices

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const invoices = useQuery(api.invoices.listInvoices, {
    status: "sent", // optional filter
});
```

### Search Invoices

```typescript
const results = useQuery(api.invoices.searchInvoices, {
    searchQuery: "SUGE-2025",
});
```

### Mark Invoice as Paid

```typescript
const markPaid = useMutation(api.invoices.markInvoicePaid);

await markPaid({
    invoiceId: "...",
    paidOn: "2025-01-15",
    paymentMethod: "Bank Transfer",
});
// Automatically creates payment record in earnings table
```

---

## 📄 PDF Generation

### Basic Usage

```typescript
import { generateInvoicePDF, downloadPDF } from "@/lib/pdf-generator";

const pdfData = {
    invoiceNumber: "SUGE-202501-0001",
    title: "Website Development",
    status: "sent",
    issuedOn: "2025-01-01",
    dueOn: "2025-01-31",
    currency: "USD",
    freelancer: {
        name: "John Doe",
        email: "john@example.com",
        company: "Freelance Co",
    },
    client: {
        name: "Jane Smith",
        email: "jane@client.com",
        company: "Client Corp",
    },
    items: [...],
    subtotal: 5000,
    totalDiscount: 0,
    totalTax: 500,
    totalAmount: 5500,
};

const blob = await generateInvoicePDF(pdfData);
downloadPDF(blob, "invoice.pdf");
```

### Server-Side PDF (Optional)

For production, consider using Puppeteer on the server:

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import puppeteer from "puppeteer";

export default httpRouter();

// Add endpoint for PDF generation
httpRouter.route({
    path: "/generate-pdf",
    method: "POST",
    handler: async (request) => {
        const invoiceData = await request.json();
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Render invoice HTML
        await page.setContent(generateInvoiceHTML(invoiceData));
        
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
        });
        
        await browser.close();
        
        return new Response(pdf, {
            headers: {
                "Content-Type": "application/pdf",
            },
        });
    },
});
```

---

## 🎨 Customization

### Add New Currency

In `invoice-editor.tsx`, add to the currency select:

```tsx
<SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
<SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
```

### Add New Tax Type

1. Update `TaxType` in `invoice-calculator.ts`:
```typescript
export type TaxType = "vat" | "gst" | "sales_tax" | "hst" | "none" | "custom";
```

2. Add to `getTaxLabel` function:
```typescript
case "hst":
    return "HST"; // Harmonized Sales Tax (Canada)
```

3. Add to schema in `convex/schema.ts`:
```typescript
v.literal("hst")
```

### Customize Invoice Template

Edit `invoice-preview.tsx` to change the layout, colors, or add your logo:

```tsx
// Add logo
<img src="/logo.png" alt="Logo" className="h-12" />

// Change colors
const primaryColor = "#your-color";
```

---

## 🔐 Security Considerations

1. **Authentication**: All Convex functions check `ctx.auth.getUserIdentity()`
2. **Authorization**: Invoices are scoped to the authenticated user
3. **Validation**: Use Zod schemas for input validation
4. **Data Privacy**: Client data is private per user

---

## 🧪 Testing

### Test Tax Calculations

```typescript
import { calculateInvoiceTotals } from "@/lib/invoice-calculator";
import { euVatExample, indianGstExample } from "@/lib/invoice-examples";

// Test EU VAT
const euResult = calculateInvoiceTotals(euVatExample);
console.assert(euResult.grandTotal === 8470, "EU VAT calculation failed");

// Test Indian GST
const gstResult = calculateInvoiceTotals(indianGstExample);
console.assert(gstResult.grandTotal === 147500, "GST calculation failed");
```

### Test Invoice Creation

```typescript
// In your test file
const testInvoice = {
    clientId: "test-client-id",
    invoiceNumber: "TEST-001",
    title: "Test Invoice",
    items: [
        {
            id: "1",
            description: "Test Service",
            quantity: 1,
            unitPrice: 1000,
        },
    ],
    taxType: "vat",
    taxRate: 20,
    taxMode: "exclusive",
    // ... other fields
};

const invoiceId = await createInvoice(testInvoice);
expect(invoiceId).toBeDefined();
```

---

## 📊 Database Queries

### Get Invoice Stats

```typescript
const stats = useQuery(api.invoices.getInvoiceStats);
// Returns: { total, draft, sent, paid, overdue, totalRevenue, pendingRevenue }
```

### Filter by Status

```typescript
const paidInvoices = useQuery(api.invoices.listInvoices, {
    status: "paid",
});
```

### Search

```typescript
const results = useQuery(api.invoices.searchInvoices, {
    searchQuery: "Website",
});
```

---

## 🌐 Internationalization

### Add Multi-Language Support

```typescript
// lib/i18n.ts
export const translations = {
    en: {
        invoice: "Invoice",
        billTo: "Bill To",
        from: "From",
        // ...
    },
    es: {
        invoice: "Factura",
        billTo: "Facturar a",
        from: "De",
        // ...
    },
};
```

### Format Dates by Locale

```typescript
const formatDate = (date: string, locale: string) => {
    return new Date(date).toLocaleDateString(locale);
};
```

---

## 🚀 Production Checklist

- [ ] Install PDF dependencies (`jspdf`, `jspdf-autotable`)
- [ ] Deploy Convex schema
- [ ] Configure freelancer profile (name, email, tax ID)
- [ ] Add clients to database
- [ ] Test invoice creation and PDF generation
- [ ] Set up email integration for sending invoices
- [ ] Configure payment gateway integration
- [ ] Add invoice templates/branding
- [ ] Set up automated reminders for overdue invoices
- [ ] Implement invoice versioning/history
- [ ] Add analytics and reporting

---

## 🆘 Troubleshooting

### PDF Generation Fails

**Issue**: `Cannot find module 'jspdf'`

**Solution**: Install dependencies
```bash
npm install jspdf jspdf-autotable @types/jspdf
```

### Tax Calculation Incorrect

**Issue**: Wrong tax amount

**Solution**: Check `taxMode` - use "exclusive" for tax on top, "inclusive" for tax included in price

### Invoice Number Collision

**Issue**: Duplicate invoice numbers

**Solution**: Add unique constraint in schema or use UUID:
```typescript
import { v4 as uuidv4 } from "uuid";
const invoiceNumber = `SUGE-${uuidv4().slice(0, 8)}`;
```

---

## 📚 Additional Resources

- [Convex Documentation](https://docs.convex.dev)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Tax Calculation Best Practices](https://stripe.com/docs/tax)
- [Invoice Design Guidelines](https://www.invoicely.com/invoice-template-guide)

---

## 🤝 Contributing

To add new features:

1. Update `invoice-calculator.ts` for tax logic
2. Update `convex/schema.ts` for data model
3. Update `invoice-editor.tsx` for UI
4. Update `invoice-preview.tsx` for display
5. Add tests and examples

---

## 📝 License

Part of Suge - Professional Freelancer SaaS Platform

---

**Built with ❤️ for freelancers worldwide**
