"use client";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterIcon, X } from "lucide-react";
import React, { useState, useMemo } from "react";
import { payments } from "./data";
import { columns } from "./columns";
import { EarningsTable } from "./earnings-table";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const EarningsTracker = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    const [paymentMethodFilters, setPaymentMethodFilters] = useState<string[]>(
        []
    );

    // Get unique values for filters
    const uniqueStatuses = useMemo(
        () => Array.from(new Set(payments.map((p) => p.status))),
        []
    );
    const uniquePaymentMethods = useMemo(
        () => Array.from(new Set(payments.map((p) => p.paymentMethod))),
        []
    );

    // Filter data based on search and filters
    const filteredData = useMemo(() => {
        return payments.filter((payment) => {
            const matchesSearch =
                searchQuery === "" ||
                payment.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                payment.notes.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilters.length === 0 ||
                statusFilters.includes(payment.status);

            const matchesPaymentMethod =
                paymentMethodFilters.length === 0 ||
                paymentMethodFilters.includes(payment.paymentMethod);

            return matchesSearch && matchesStatus && matchesPaymentMethod;
        });
    }, [searchQuery, statusFilters, paymentMethodFilters]);

    const toggleStatusFilter = (status: string) => {
        setStatusFilters((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        );
    };

    const togglePaymentMethodFilter = (method: string) => {
        setPaymentMethodFilters((prev) =>
            prev.includes(method)
                ? prev.filter((m) => m !== method)
                : [...prev, method]
        );
    };

    const clearAllFilters = () => {
        setStatusFilters([]);
        setPaymentMethodFilters([]);
        setSearchQuery("");
    };

    const activeFiltersCount =
        statusFilters.length + paymentMethodFilters.length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
        >
            <SiteHeader title="Earnings Tracker" />
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="px-4 py-4 md:py-6 flex flex-col"
            >
                <h1 className="text-xl md:text-2xl font-semibold">Payments</h1>
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex flex-col md:flex-row mt-4 gap-3 md:gap-0 md:justify-between"
                >
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
                        <Input
                            className="w-full sm:w-[250px] lg:w-[300px] border border-muted-foreground/25"
                            placeholder="Search payments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="px-4 relative w-full sm:w-auto"
                                    variant={"secondary"}
                                >
                                    <FilterIcon className="h-4 w-4" />
                                    <span className="ml-2">Filter</span>
                                    {activeFiltersCount > 0 && (
                                        <Badge
                                            variant="default"
                                            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                        >
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>
                                    Filter by Status
                                </DropdownMenuLabel>
                                {uniqueStatuses.map((status) => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={statusFilters.includes(status)}
                                        onCheckedChange={() =>
                                            toggleStatusFilter(status)
                                        }
                                    >
                                        {status}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    Filter by Payment Method
                                </DropdownMenuLabel>
                                {uniquePaymentMethods.map((method) => (
                                    <DropdownMenuCheckboxItem
                                        key={method}
                                        checked={paymentMethodFilters.includes(
                                            method
                                        )}
                                        onCheckedChange={() =>
                                            togglePaymentMethodFilter(method)
                                        }
                                    >
                                        {method}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                {activeFiltersCount > 0 && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <Button
                                            variant="ghost"
                                            className="w-full text-sm"
                                            onClick={clearAllFilters}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Clear all filters
                                        </Button>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
                        <Button
                            className="px-4 w-full sm:w-auto"
                            variant={"outline"}
                        >
                            See Invoices
                        </Button>
                        <Button
                            onClick={() => router.push("/create-payment")}
                            className="px-4 w-full sm:w-auto"
                            variant={"default"}
                        >
                            Add Payment
                        </Button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {activeFiltersCount > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-wrap gap-2 mt-3 md:mt-4"
                        >
                            {statusFilters.map((status) => (
                                <Badge
                                    key={status}
                                    variant="secondary"
                                    className="cursor-pointer text-xs md:text-sm"
                                    onClick={() => toggleStatusFilter(status)}
                                >
                                    {status}
                                    <X className="h-3 w-3 ml-1" />
                                </Badge>
                            ))}
                            {paymentMethodFilters.map((method) => (
                                <Badge
                                    key={method}
                                    variant="secondary"
                                    className="cursor-pointer text-xs md:text-sm"
                                    onClick={() =>
                                        togglePaymentMethodFilter(method)
                                    }
                                >
                                    {method}
                                    <X className="h-3 w-3 ml-1" />
                                </Badge>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-4 md:mt-6 overflow-x-auto"
                >
                    <EarningsTable columns={columns} data={filteredData} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default EarningsTracker;
