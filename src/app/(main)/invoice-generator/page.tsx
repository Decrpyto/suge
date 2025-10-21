"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { InvoiceEditor } from "@/components/invoice-editor";
import { InvoicePreview } from "@/components/invoice-preview";
import { toast } from "sonner";
import { generateInvoicePDF, downloadPDF } from "@/lib/pdf-generator";
import { useRouter } from "next/navigation";

// Mock data - replace with actual Convex queries
const mockClients = [
    {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        company: "Acme Corp",
        address: "123 Business St, New York, NY 10001",
        phone: "+1 (555) 123-4567",
        taxId: "12-3456789",
    },
    {
        _id: "2",
        name: "Jane Smith",
        email: "jane@techstart.io",
        company: "TechStart Inc",
        address: "456 Tech Ave, San Francisco, CA 94105",
        phone: "+1 (555) 987-6543",
        taxId: "98-7654321",
    },
];

const mockFreelancer = {
    name: "Natsu Group",
    email: "natsu.gr@gmail.com",
    company: "Natsu Group",
    address: "09 Arnulfo Crossing, Botsfordborough",
    phone: "+1 (603) 555-0123",
    taxId: "6-7343-91840-42-2",
    accountNumber: "39964855321841",
};

const InvoiceGenerator = () => {
    const router = useRouter();
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    const handleSave = async (invoice: any) => {
        try {
            // TODO: Replace with actual Convex mutation
            // const invoiceId = await createInvoice(invoice);

            console.log("Saving invoice:", invoice);

            toast.success(
                invoice.status === "draft"
                    ? "Invoice saved as draft"
                    : "Invoice sent successfully!"
            );

            // Redirect to invoices list or detail page
            // router.push(`/invoices/${invoiceId}`);
        } catch (error) {
            console.error("Error saving invoice:", error);
            toast.error("Failed to save invoice");
        }
    };

    const handlePreview = (invoice: any) => {
        setPreviewData(invoice);
        setShowPreview(true);
    };

    const handleDownloadPDF = async () => {
        if (!previewData) return;

        try {
            toast.loading("Generating PDF...");

            const client = mockClients.find(
                (c) => c._id === previewData.clientId
            );
            if (!client) {
                toast.error("Client not found");
                return;
            }

            const pdfData = {
                ...previewData,
                freelancer: mockFreelancer,
                client,
                items: previewData.items.map((item: any) => ({
                    ...item,
                    amount:
                        item.quantity * item.unitPrice -
                        (item.quantity *
                            item.unitPrice *
                            (item.discount || 0)) /
                            100,
                })),
            };

            const blob = await generateInvoicePDF(pdfData);
            downloadPDF(blob, `${previewData.invoiceNumber}.pdf`);

            toast.dismiss();
            toast.success("PDF downloaded successfully!");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.dismiss();
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <SiteHeader title="Invoice Generator" />

            <motion.div
                className="flex-1 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <InvoiceEditor
                    clients={mockClients}
                    onSave={handleSave}
                    onPreview={handlePreview}
                />
            </motion.div>

            {showPreview && previewData && (
                <InvoicePreview
                    invoice={previewData}
                    freelancer={mockFreelancer}
                    client={
                        mockClients.find(
                            (c) => c._id === previewData.clientId
                        ) || {
                            name: "Unknown",
                            email: "",
                            company: "",
                        }
                    }
                    onClose={() => setShowPreview(false)}
                    onDownloadPDF={handleDownloadPDF}
                />
            )}
        </div>
    );
};

export default InvoiceGenerator;
