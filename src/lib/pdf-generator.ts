/**
 * PDF Generation for Invoices
 * Uses jsPDF for client-side PDF generation
 */

import { formatCurrency } from "./invoice-calculator";

// Note: Install jspdf and jspdf-autotable
// npm install jspdf jspdf-autotable
// npm install --save-dev @types/jspdf

export interface PDFInvoiceData {
    invoiceNumber: string;
    title: string;
    status: string;
    issuedOn: string;
    dueOn: string;
    currency: string;
    
    // Freelancer info
    freelancer: {
        name: string;
        email: string;
        company?: string;
        address?: string;
        phone?: string;
        taxId?: string;
    };
    
    // Client info
    client: {
        name: string;
        email: string;
        company: string;
        address?: string;
    };
    
    // Line items
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        discount?: number;
        amount: number;
    }>;
    
    // Totals
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    totalAmount: number;
    
    // Tax details
    taxType?: string;
    taxRate?: number;
    taxMode?: string;
    reverseCharge?: boolean;
    withholdingTax?: number;
    gstBreakdown?: {
        cgst?: number;
        sgst?: number;
        igst?: number;
    };
    
    // Additional
    notes?: string;
    terms?: string;
}

/**
 * Generate PDF invoice using jsPDF
 * This is a simplified version - for production, consider using a library like react-pdf or puppeteer
 */
export async function generateInvoicePDF(data: PDFInvoiceData): Promise<Blob> {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;
    
    // Enhanced Colors
    const primaryColor: [number, number, number] = [59, 130, 246]; // Blue-500
    const purpleColor: [number, number, number] = [147, 51, 234]; // Purple-600
    const grayColor: [number, number, number] = [107, 114, 128];
    const darkColor: [number, number, number] = [17, 24, 39];
    const lightBg: [number, number, number] = [249, 250, 251];
    
    // Header Background with gradient effect
    doc.setFillColor(...primaryColor);
    doc.roundedRect(15, 15, pageWidth - 30, 35, 3, 3, "F");
    
    // Add purple accent (simplified - no opacity)
    doc.setFillColor(...purpleColor);
    doc.roundedRect(pageWidth - 80, 15, 65, 35, 3, 3, "F");
    
    // Header - INVOICE
    doc.setFontSize(36);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 22, 32);
    
    // Invoice Number
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text(data.invoiceNumber, 22, 42);
    
    // Status Badge
    const statusColors: Record<string, [number, number, number]> = {
        paid: [34, 197, 94],
        sent: [59, 130, 246],
        draft: [156, 163, 175],
        overdue: [239, 68, 68],
    };
    const statusColor = statusColors[data.status] || grayColor;
    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth - 42, 25, 24, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(data.status.toUpperCase(), pageWidth - 30, 31, { align: "center" });
    
    yPos = 60;
    
    // From / To Section
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "bold");
    doc.text("FROM", 20, yPos);
    doc.text("BILL TO", pageWidth / 2 + 10, yPos);
    
    yPos += 5;
    
    // From Details
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text(data.freelancer.name, 20, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    yPos += 5;
    
    if (data.freelancer.company) {
        doc.text(data.freelancer.company, 20, yPos);
        yPos += 4;
    }
    doc.text(data.freelancer.email, 20, yPos);
    yPos += 4;
    if (data.freelancer.phone) {
        doc.text(data.freelancer.phone, 20, yPos);
        yPos += 4;
    }
    if (data.freelancer.address) {
        const addressLines = doc.splitTextToSize(data.freelancer.address, 80);
        doc.text(addressLines, 20, yPos);
        yPos += addressLines.length * 4;
    }
    if (data.freelancer.taxId) {
        doc.setTextColor(...grayColor);
        doc.text(`Tax ID: ${data.freelancer.taxId}`, 20, yPos);
    }
    
    // To Details
    yPos = 45;
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(data.client.name, pageWidth / 2 + 10, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    yPos += 5;
    doc.text(data.client.company, pageWidth / 2 + 10, yPos);
    yPos += 4;
    doc.text(data.client.email, pageWidth / 2 + 10, yPos);
    yPos += 4;
    if (data.client.address) {
        const addressLines = doc.splitTextToSize(data.client.address, 80);
        doc.text(addressLines, pageWidth / 2 + 10, yPos);
    }
    
    yPos = 85;
    
    // Invoice Details Box with enhanced styling
    doc.setFillColor(...lightBg);
    doc.roundedRect(20, yPos, pageWidth - 40, 22, 3, 3, "F");
    
    // Add border
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, yPos, pageWidth - 40, 22, 3, 3, "S");
    
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "bold");
    doc.text("ISSUE DATE", 25, yPos + 7);
    doc.text("DUE DATE", pageWidth / 2 - 10, yPos + 7);
    doc.text("AMOUNT DUE", pageWidth - 60, yPos + 7);
    
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text(new Date(data.issuedOn).toLocaleDateString(), 25, yPos + 14);
    doc.text(new Date(data.dueOn).toLocaleDateString(), pageWidth / 2 - 10, yPos + 14);
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.text(formatCurrency(data.totalAmount, data.currency), pageWidth - 60, yPos + 14);
    
    yPos += 32;
    
    // Invoice Title
    if (data.title) {
        doc.setFontSize(14);
        doc.setTextColor(...darkColor);
        doc.setFont("helvetica", "bold");
        doc.text(data.title, 20, yPos);
        yPos += 10;
    }
    
    // Line Items Table
    const tableData = data.items.map((item) => [
        item.description,
        item.quantity.toString(),
        formatCurrency(item.unitPrice, data.currency),
        item.discount ? `${item.discount}%` : "-",
        formatCurrency(item.amount, data.currency),
    ]);
    
    autoTable(doc, {
        startY: yPos,
        head: [["Description", "Qty", "Rate", "Discount", "Amount"]],
        body: tableData,
        theme: "plain",
        headStyles: {
            fillColor: [249, 250, 251],
            textColor: [107, 114, 128],
            fontSize: 8,
            fontStyle: "bold",
            halign: "left",
        },
        bodyStyles: {
            textColor: [17, 24, 39],
            fontSize: 9,
        },
        columnStyles: {
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right", fontStyle: "bold" },
        },
        margin: { left: 20, right: 20 },
    });
    
    // @ts-ignore - autoTable adds finalY to doc
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Totals Section
    const totalsX = pageWidth - 80;
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    
    doc.text("Subtotal", totalsX, yPos);
    doc.text(formatCurrency(data.subtotal, data.currency), pageWidth - 25, yPos, {
        align: "right",
    });
    yPos += 5;
    
    if (data.totalDiscount > 0) {
        doc.setTextColor(239, 68, 68);
        doc.text("Total Discount", totalsX, yPos);
        doc.text(`-${formatCurrency(data.totalDiscount, data.currency)}`, pageWidth - 25, yPos, {
            align: "right",
        });
        yPos += 5;
        doc.setTextColor(...grayColor);
    }
    
    // Tax breakdown
    if (data.gstBreakdown) {
        if (data.gstBreakdown.cgst) {
            doc.text(`CGST (${data.gstBreakdown.cgst}%)`, totalsX, yPos);
            const cgstAmount = ((data.subtotal - data.totalDiscount) * data.gstBreakdown.cgst) / 100;
            doc.text(formatCurrency(cgstAmount, data.currency), pageWidth - 25, yPos, {
                align: "right",
            });
            yPos += 5;
        }
        if (data.gstBreakdown.sgst) {
            doc.text(`SGST (${data.gstBreakdown.sgst}%)`, totalsX, yPos);
            const sgstAmount = ((data.subtotal - data.totalDiscount) * data.gstBreakdown.sgst) / 100;
            doc.text(formatCurrency(sgstAmount, data.currency), pageWidth - 25, yPos, {
                align: "right",
            });
            yPos += 5;
        }
        if (data.gstBreakdown.igst) {
            doc.text(`IGST (${data.gstBreakdown.igst}%)`, totalsX, yPos);
            const igstAmount = ((data.subtotal - data.totalDiscount) * data.gstBreakdown.igst) / 100;
            doc.text(formatCurrency(igstAmount, data.currency), pageWidth - 25, yPos, {
                align: "right",
            });
            yPos += 5;
        }
    } else if (data.totalTax > 0 && !data.reverseCharge) {
        doc.text(`Tax (${data.taxRate}%)`, totalsX, yPos);
        doc.text(formatCurrency(data.totalTax, data.currency), pageWidth - 25, yPos, {
            align: "right",
        });
        yPos += 5;
    }
    
    if (data.reverseCharge) {
        doc.setFont("helvetica", "italic");
        doc.text("Reverse Charge Applicable", totalsX, yPos);
        doc.text("-", pageWidth - 25, yPos, { align: "right" });
        yPos += 5;
        doc.setFont("helvetica", "normal");
    }
    
    if (data.withholdingTax && data.withholdingTax > 0) {
        doc.setTextColor(239, 68, 68);
        doc.text(`TDS (${data.withholdingTax}%)`, totalsX, yPos);
        const tdsAmount = ((data.subtotal - data.totalDiscount + data.totalTax) * data.withholdingTax) / 100;
        doc.text(`-${formatCurrency(tdsAmount, data.currency)}`, pageWidth - 25, yPos, {
            align: "right",
        });
        yPos += 5;
        doc.setTextColor(...grayColor);
    }
    
    // Draw line
    doc.setDrawColor(...grayColor);
    doc.line(totalsX, yPos, pageWidth - 20, yPos);
    yPos += 7;
    
    // Grand Total
    doc.setFontSize(12);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount", totalsX, yPos);
    doc.setFontSize(16);
    doc.text(formatCurrency(data.totalAmount, data.currency), pageWidth - 25, yPos, {
        align: "right",
    });
    
    yPos += 15;
    
    // Notes
    if (data.notes && yPos < pageHeight - 40) {
        doc.setFontSize(9);
        doc.setTextColor(...darkColor);
        doc.setFont("helvetica", "bold");
        doc.text("Notes", 20, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...grayColor);
        doc.setFontSize(8);
        const notesLines = doc.splitTextToSize(data.notes, pageWidth - 40);
        doc.text(notesLines, 20, yPos);
        yPos += notesLines.length * 4 + 5;
    }
    
    // Terms
    if (data.terms && yPos < pageHeight - 30) {
        doc.setFontSize(9);
        doc.setTextColor(...darkColor);
        doc.setFont("helvetica", "bold");
        doc.text("Terms & Conditions", 20, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...grayColor);
        doc.setFontSize(8);
        const termsLines = doc.splitTextToSize(data.terms, pageWidth - 40);
        doc.text(termsLines, 20, yPos);
    }
    
    // Footer
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 15, {
        align: "center",
    });
    doc.setFontSize(6);
    doc.text(
        "Generated by Suge - Professional Freelancer Tools",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
    );
    
    // Return as Blob
    return doc.output("blob");
}

/**
 * Download PDF
 */
export function downloadPDF(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
