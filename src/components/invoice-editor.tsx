"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Trash2,
    Save,
    Send,
    Eye,
    FileText,
    Edit3,
    Calendar,
    DollarSign,
    ChevronDown,
    Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    calculateInvoiceTotals,
    generateInvoiceNumber,
    formatCurrency,
    type InvoiceLineItem,
    type TaxType,
    type TaxMode,
} from "@/lib/invoice-calculator";

interface Client {
    _id: string;
    name: string;
    email: string;
    company: string;
    address?: string;
    phone?: string;
    taxId?: string;
}

interface InvoiceEditorProps {
    clients: Client[];
    onSave: (invoice: any) => void;
    onPreview: (invoice: any) => void;
    initialData?: any;
}

export function InvoiceEditor({
    clients,
    onSave,
    onPreview,
    initialData,
}: InvoiceEditorProps) {
    // Basic fields
    const [invoiceNumber, setInvoiceNumber] = useState(
        initialData?.invoiceNumber || "INV-006489162154"
    );
    const [title, setTitle] = useState(initialData?.title || "");
    const [clientId, setClientId] = useState(initialData?.clientId || "1");
    const [issuedOn, setIssuedOn] = useState(
        initialData?.issuedOn || "2024-11-23"
    );
    const [dueOn, setDueOn] = useState(initialData?.dueOn || "2024-11-25");

    // Line items
    const [items, setItems] = useState<InvoiceLineItem[]>(
        initialData?.items || [
            {
                id: "1",
                description: "CP-2450-1-0065",
                quantity: 5,
                unitPrice: 5.22,
                discount: 0,
            },
            {
                id: "2",
                description: "CP-2980-3-0518",
                quantity: 3,
                unitPrice: 17.84,
                discount: 0,
            },
            {
                id: "3",
                description: "CP-2950-3-0015",
                quantity: 4,
                unitPrice: 11.7,
                discount: 0,
            },
        ]
    );

    // Tax configuration
    const [currency, setCurrency] = useState(initialData?.currency || "USD");
    const [taxType, setTaxType] = useState<TaxType>(
        initialData?.taxType || "none"
    );
    const [taxRate, setTaxRate] = useState(initialData?.taxRate || 0);
    const [taxMode, setTaxMode] = useState<TaxMode>(
        initialData?.taxMode || "exclusive"
    );
    const [reverseCharge, setReverseCharge] = useState(
        initialData?.reverseCharge || false
    );
    const [withholdingTax, setWithholdingTax] = useState(
        initialData?.withholdingTax || 0
    );
    const [customTaxLabel, setCustomTaxLabel] = useState(
        initialData?.customTaxLabel || ""
    );

    // GST breakdown (India)
    const [gstCgst, setGstCgst] = useState(
        initialData?.gstBreakdown?.cgst || 0
    );
    const [gstSgst, setGstSgst] = useState(
        initialData?.gstBreakdown?.sgst || 0
    );
    const [gstIgst, setGstIgst] = useState(
        initialData?.gstBreakdown?.igst || 0
    );

    // Additional fields
    const [notes, setNotes] = useState(
        initialData?.notes ||
            "Timely payment ensures no delays or additional charges thank you for your attention."
    );
    const [terms, setTerms] = useState(
        initialData?.terms ||
            "Payment is due within 30 days. Late payments may incur additional charges."
    );

    // Calculate totals
    const totals = calculateInvoiceTotals({
        items,
        currency,
        taxType,
        taxRate,
        taxMode,
        reverseCharge,
        withholdingTax: withholdingTax > 0 ? withholdingTax : undefined,
        customTaxLabel: customTaxLabel || undefined,
        gstBreakdown:
            taxType === "gst" && (gstCgst > 0 || gstSgst > 0 || gstIgst > 0)
                ? {
                      cgst: gstCgst > 0 ? gstCgst : undefined,
                      sgst: gstSgst > 0 ? gstSgst : undefined,
                      igst: gstIgst > 0 ? gstIgst : undefined,
                  }
                : undefined,
    });

    // Add line item
    const addLineItem = () => {
        setItems([
            ...items,
            {
                id: String(items.length + 1),
                description: "",
                quantity: 1,
                unitPrice: 0,
                discount: 0,
            },
        ]);
    };

    // Remove line item
    const removeLineItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    // Update line item
    const updateLineItem = (
        id: string,
        field: keyof InvoiceLineItem,
        value: any
    ) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    // Build invoice object
    const buildInvoice = (status: "draft" | "sent") => {
        return {
            invoiceNumber,
            title,
            clientId,
            items,
            taxType,
            taxRate,
            taxMode,
            reverseCharge,
            withholdingTax: withholdingTax > 0 ? withholdingTax : undefined,
            customTaxLabel: customTaxLabel || undefined,
            gstBreakdown:
                taxType === "gst" && (gstCgst > 0 || gstSgst > 0 || gstIgst > 0)
                    ? {
                          cgst: gstCgst > 0 ? gstCgst : undefined,
                          sgst: gstSgst > 0 ? gstSgst : undefined,
                          igst: gstIgst > 0 ? gstIgst : undefined,
                      }
                    : undefined,
            subtotal: totals.subtotal,
            totalDiscount: totals.totalDiscount,
            totalTax: totals.totalTax,
            totalAmount: totals.grandTotal,
            currency,
            notes,
            terms,
            status,
            issuedOn,
            dueOn,
        };
    };

    const selectedClient = clients.find((c) => c._id === clientId);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-screen">
                {/* Left Column - Invoice Detail */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-foreground">
                            Invoice Detail
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                                <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                                    <span className="text-primary-foreground text-xs font-bold">
                                        N
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-primary">
                                    Natsu Group
                                </span>
                                <ChevronDown className="h-4 w-4 text-primary" />
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Company Detail Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-muted/50 border-b">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold">
                                        Company Detail
                                    </CardTitle>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-muted-foreground"
                                        >
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            Edit Details
                                        </Button>
                                    </motion.div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Company Name
                                        </p>
                                        <p className="font-medium">
                                            Natsu Group
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Email Address
                                        </p>
                                        <p className="font-medium">
                                            natsu.gr@gmail.com
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Address
                                        </p>
                                        <p className="font-medium">
                                            09 Arnulfo Crossing, Botsfordborough
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Tax ID
                                        </p>
                                        <p className="font-medium">
                                            6-7343-91840-42-2
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Phone Number
                                        </p>
                                        <p className="font-medium">
                                            +1 (603) 555-0123
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Account Number
                                        </p>
                                        <p className="font-medium">
                                            39964855321841
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Invoice Fields */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-foreground">
                                    Invoice Number
                                </Label>
                                <Input
                                    value={invoiceNumber}
                                    onChange={(e) =>
                                        setInvoiceNumber(e.target.value)
                                    }
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-foreground">
                                    Currency
                                </Label>
                                <Select
                                    value={currency}
                                    onValueChange={setCurrency}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">
                                            US Dollar
                                        </SelectItem>
                                        <SelectItem value="EUR">
                                            Euro
                                        </SelectItem>
                                        <SelectItem value="GBP">
                                            British Pound
                                        </SelectItem>
                                        <SelectItem value="INR">
                                            Indian Rupee
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-foreground">
                                    Date of Issue
                                </Label>
                                <div className="relative mt-1">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        value={issuedOn}
                                        onChange={(e) =>
                                            setIssuedOn(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-foreground">
                                    Due Date
                                </Label>
                                <div className="relative mt-1">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        value={dueOn}
                                        onChange={(e) =>
                                            setDueOn(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Client Detail Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-muted/50 border-b">
                                <CardTitle className="text-lg font-semibold">
                                    Client Detail
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Company Name
                                        </p>
                                        <p className="font-medium">
                                            {selectedClient?.company ||
                                                "Select Client"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Email Address
                                        </p>
                                        <p className="font-medium">
                                            {selectedClient?.email || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Address
                                        </p>
                                        <p className="font-medium">
                                            {selectedClient?.address || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Tax ID
                                        </p>
                                        <p className="font-medium">
                                            {selectedClient?.taxId || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Phone Number
                                        </p>
                                        <p className="font-medium">
                                            {selectedClient?.phone || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Account Number
                                        </p>
                                        <p className="font-medium">
                                            354971264932574
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Label className="text-sm font-medium text-foreground">
                                        Select Client
                                    </Label>
                                    <Select
                                        value={clientId}
                                        onValueChange={setClientId}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem
                                                    key={client._id}
                                                    value={client._id}
                                                >
                                                    {client.name} -{" "}
                                                    {client.company}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Product Table Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-lg">
                            <div className="grid grid-cols-4 gap-4 text-sm font-semibold">
                                <div>Product ID</div>
                                <div className="text-right">Unit Price</div>
                                <div className="text-right">Qty</div>
                                <div className="text-right">Amount</div>
                            </div>
                        </div>
                        <div className="border border-t-0 rounded-b-lg">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0 hover:bg-muted/50"
                                >
                                    <div>
                                        <Input
                                            value={item.description}
                                            onChange={(e) =>
                                                updateLineItem(
                                                    item.id,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="border-0 p-0 h-auto font-medium"
                                            placeholder="Product ID"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) =>
                                                updateLineItem(
                                                    item.id,
                                                    "unitPrice",
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0
                                                )
                                            }
                                            className="border-0 p-0 h-auto text-right"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateLineItem(
                                                    item.id,
                                                    "quantity",
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0
                                                )
                                            }
                                            className="border-0 p-0 h-auto text-right"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="text-right flex items-center justify-between">
                                        <span className="font-medium">
                                            {formatCurrency(
                                                item.quantity * item.unitPrice -
                                                    (item.quantity *
                                                        item.unitPrice *
                                                        (item.discount || 0)) /
                                                        100,
                                                currency
                                            )}
                                        </span>
                                        {items.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    removeLineItem(item.id)
                                                }
                                                className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            <div className="p-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        variant="outline"
                                        onClick={addLineItem}
                                        className="w-full border-dashed border-2 border-muted-foreground/25 hover:border-primary hover:text-primary"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Product
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Column - Invoice Preview */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-foreground">
                            Invoice Preview
                        </h1>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="outline"
                                className="text-muted-foreground"
                                onClick={() => onSave(buildInvoice("draft"))}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Save to Draft
                            </Button>
                        </motion.div>
                    </div>

                    {/* Invoice Preview Card */}
                    <motion.div
                        className="bg-card rounded-lg shadow-lg border-2 border-border overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {/* Invoice Header */}
                        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-4xl font-bold">
                                        INVOICE
                                    </h2>
                                    <p className="text-sm mt-2 opacity-90">
                                        {invoiceNumber}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm opacity-90">
                                        Date of Issue
                                    </div>
                                    <div className="font-semibold">
                                        {new Date(
                                            issuedOn
                                        ).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm opacity-90 mt-2">
                                        Due Date
                                    </div>
                                    <div className="font-semibold">
                                        {new Date(dueOn).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                                    <span className="text-primary-foreground text-sm font-bold">
                                        N
                                    </span>
                                </div>
                                <span className="text-lg font-semibold text-primary">
                                    Natsu Group
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                                        Send To:
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="font-semibold">
                                            {selectedClient?.company ||
                                                "Client Company"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedClient?.address ||
                                                "Client Address"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedClient?.phone ||
                                                "Client Phone"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                                        Send From:
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="font-semibold">
                                            Natsu Group
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            09 Arnulfo Crossing, Botsfordborough
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            +1 (603) 555-0123
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Table */}
                            <div className="border border-border rounded-lg overflow-hidden mb-6">
                                <div className="bg-primary text-primary-foreground">
                                    <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm font-semibold">
                                        <div>Product ID</div>
                                        <div className="text-right">
                                            Unit Price
                                        </div>
                                        <div className="text-right">Qty</div>
                                        <div className="text-right">Amount</div>
                                    </div>
                                </div>
                                <div className="divide-y">
                                    {items.map((item) => {
                                        const lineTotal =
                                            item.quantity * item.unitPrice;
                                        const discountAmount =
                                            (lineTotal * (item.discount || 0)) /
                                            100;
                                        const finalAmount =
                                            lineTotal - discountAmount;

                                        return (
                                            <div
                                                key={item.id}
                                                className="grid grid-cols-4 gap-4 px-4 py-3 text-sm"
                                            >
                                                <div className="font-medium">
                                                    {item.description}
                                                </div>
                                                <div className="text-right">
                                                    {formatCurrency(
                                                        item.unitPrice,
                                                        currency
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {item.quantity}
                                                </div>
                                                <div className="text-right font-medium">
                                                    {formatCurrency(
                                                        finalAmount,
                                                        currency
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-80 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                totals.subtotal,
                                                currency
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Tax
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                totals.totalTax,
                                                currency
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Discount
                                        </span>
                                        <span className="font-medium text-destructive">
                                            5%
                                        </span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total Amount</span>
                                            <span className="text-primary">
                                                {formatCurrency(
                                                    totals.grandTotal,
                                                    currency
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                                <h3 className="text-sm font-semibold text-foreground mb-2">
                                    Notes
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {notes}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 p-6 bg-muted/50 border-t">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outline"
                                    className="text-muted-foreground"
                                >
                                    Cancel
                                </Button>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={() =>
                                        onPreview(buildInvoice("draft"))
                                    }
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Print Invoice
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
