"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Printer, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/invoice-calculator";

interface InvoicePreviewProps {
    invoice: any;
    freelancer?: {
        name: string;
        email: string;
        company?: string;
        address?: string;
        phone?: string;
        taxId?: string;
    };
    client: {
        name: string;
        email: string;
        company: string;
        address?: string;
    };
    onClose: () => void;
    onDownloadPDF?: () => void;
}

export function InvoicePreview({
    invoice,
    freelancer,
    client,
    onClose,
    onDownloadPDF,
}: InvoicePreviewProps) {
    const handlePrint = () => {
        window.print();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-500";
            case "sent":
                return "bg-blue-500";
            case "overdue":
                return "bg-red-500";
            case "draft":
                return "bg-gray-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border-2 border-blue-500/20"
            >
                {/* Header Actions */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Invoice Preview</h2>
                    </div>
                    <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" onClick={handlePrint} className="shadow-md">
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                            </Button>
                        </motion.div>
                        {onDownloadPDF && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="sm" onClick={onDownloadPDF} className="shadow-md">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                </Button>
                            </motion.div>
                        )}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white">
                    <motion.div 
                        className="max-w-3xl mx-auto space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl text-white">
                            <div>
                                <h1 className="text-5xl font-bold tracking-tight">INVOICE</h1>
                                <p className="text-sm mt-2 opacity-90">
                                    {invoice.invoiceNumber}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge
                                    className={`${getStatusColor(invoice.status)} text-white uppercase text-sm px-4 py-2 shadow-lg`}
                                >
                                    {invoice.status}
                                </Badge>
                            </div>
                        </div>

                        {/* From/To Section */}
                        <div className="grid grid-cols-2 gap-8">
                            {/* From */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                    From
                                </h3>
                                <div className="space-y-1">
                                    <p className="font-semibold text-gray-900">
                                        {freelancer?.name || "Your Name"}
                                    </p>
                                    {freelancer?.company && (
                                        <p className="text-sm text-gray-600">
                                            {freelancer.company}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        {freelancer?.email || "your@email.com"}
                                    </p>
                                    {freelancer?.phone && (
                                        <p className="text-sm text-gray-600">
                                            {freelancer.phone}
                                        </p>
                                    )}
                                    {freelancer?.address && (
                                        <p className="text-sm text-gray-600">
                                            {freelancer.address}
                                        </p>
                                    )}
                                    {freelancer?.taxId && (
                                        <p className="text-sm text-gray-600">
                                            Tax ID: {freelancer.taxId}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* To */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Bill To
                                </h3>
                                <div className="space-y-1">
                                    <p className="font-semibold text-gray-900">
                                        {client.name}
                                    </p>
                                    <p className="text-sm text-gray-600">{client.company}</p>
                                    <p className="text-sm text-gray-600">{client.email}</p>
                                    {client.address && (
                                        <p className="text-sm text-gray-600">
                                            {client.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-md">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Issue Date</p>
                                <p className="font-bold text-foreground mt-1">
                                    {new Date(invoice.issuedOn).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Due Date</p>
                                <p className="font-bold text-foreground mt-1">
                                    {new Date(invoice.dueOn).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Amount Due</p>
                                <p className="font-bold text-xl text-blue-600 dark:text-blue-400 mt-1">
                                    {formatCurrency(invoice.totalAmount, invoice.currency)}
                                </p>
                            </div>
                        </div>

                        {/* Invoice Title */}
                        {invoice.title && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {invoice.title}
                                </h2>
                            </div>
                        )}

                        {/* Line Items Table */}
                        <div className="border-2 border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden shadow-lg">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    <tr>
                                        <th className="text-left text-xs font-bold uppercase px-4 py-4">
                                            Description
                                        </th>
                                        <th className="text-right text-xs font-bold uppercase px-4 py-4">
                                            Qty
                                        </th>
                                        <th className="text-right text-xs font-bold uppercase px-4 py-4">
                                            Rate
                                        </th>
                                        {invoice.items.some((item: any) => item.discount > 0) && (
                                            <th className="text-right text-xs font-bold uppercase px-4 py-4">
                                                Discount
                                            </th>
                                        )}
                                        <th className="text-right text-xs font-bold uppercase px-4 py-4">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {invoice.items.map((item: any, index: number) => {
                                        const lineTotal = item.quantity * item.unitPrice;
                                        const discountAmount = item.discount
                                            ? (lineTotal * item.discount) / 100
                                            : 0;
                                        const finalAmount = lineTotal - discountAmount;

                                        return (
                                            <tr key={index}>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {item.description}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-900">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-900">
                                                    {formatCurrency(
                                                        item.unitPrice,
                                                        invoice.currency
                                                    )}
                                                </td>
                                                {invoice.items.some(
                                                    (item: any) => item.discount > 0
                                                ) && (
                                                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                                                        {item.discount
                                                            ? `${item.discount}%`
                                                            : "-"}
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                    {formatCurrency(
                                                        finalAmount,
                                                        invoice.currency
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end">
                            <div className="w-80 space-y-2 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(invoice.subtotal, invoice.currency)}
                                    </span>
                                </div>

                                {invoice.totalDiscount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Discount</span>
                                        <span className="font-medium text-red-600">
                                            -
                                            {formatCurrency(
                                                invoice.totalDiscount,
                                                invoice.currency
                                            )}
                                        </span>
                                    </div>
                                )}

                                <Separator />

                                {/* GST Breakdown */}
                                {invoice.gstBreakdown && (
                                    <>
                                        {invoice.gstBreakdown.cgst && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    CGST ({invoice.gstBreakdown.cgst}%)
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(
                                                        (invoice.subtotal -
                                                            invoice.totalDiscount) *
                                                            (invoice.gstBreakdown.cgst / 100),
                                                        invoice.currency
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {invoice.gstBreakdown.sgst && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    SGST ({invoice.gstBreakdown.sgst}%)
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(
                                                        (invoice.subtotal -
                                                            invoice.totalDiscount) *
                                                            (invoice.gstBreakdown.sgst / 100),
                                                        invoice.currency
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {invoice.gstBreakdown.igst && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    IGST ({invoice.gstBreakdown.igst}%)
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(
                                                        (invoice.subtotal -
                                                            invoice.totalDiscount) *
                                                            (invoice.gstBreakdown.igst / 100),
                                                        invoice.currency
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Regular Tax */}
                                {!invoice.gstBreakdown &&
                                    invoice.totalTax > 0 &&
                                    !invoice.reverseCharge && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {invoice.customTaxLabel || "Tax"} (
                                                {invoice.taxRate}%)
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {formatCurrency(
                                                    invoice.totalTax,
                                                    invoice.currency
                                                )}
                                            </span>
                                        </div>
                                    )}

                                {/* Reverse Charge */}
                                {invoice.reverseCharge && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 italic">
                                            Reverse Charge Applicable
                                        </span>
                                        <span className="font-medium text-gray-900">-</span>
                                    </div>
                                )}

                                {/* Withholding Tax */}
                                {invoice.withholdingTax && invoice.withholdingTax > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            TDS ({invoice.withholdingTax}%)
                                        </span>
                                        <span className="font-medium text-red-600">
                                            -
                                            {formatCurrency(
                                                ((invoice.subtotal -
                                                    invoice.totalDiscount +
                                                    invoice.totalTax) *
                                                    invoice.withholdingTax) /
                                                    100,
                                                invoice.currency
                                            )}
                                        </span>
                                    </div>
                                )}

                                <Separator className="my-2" />

                                <div className="flex justify-between pt-2 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white shadow-lg">
                                    <span className="font-bold text-lg">
                                        Total Amount
                                    </span>
                                    <span className="text-3xl font-bold">
                                        {formatCurrency(
                                            invoice.totalAmount,
                                            invoice.currency
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {invoice.notes && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                    {invoice.notes}
                                </p>
                            </div>
                        )}

                        {/* Terms */}
                        {invoice.terms && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Terms & Conditions
                                </h3>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                    {invoice.terms}
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="pt-8 border-t-2 border-blue-200 dark:border-blue-800 text-center">
                            <p className="text-sm text-muted-foreground font-medium">
                                Thank you for your business!
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-2">
                                Generated by Suge - Professional Freelancer Tools
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
