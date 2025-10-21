"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

export type Payment = {
    _id: string;
    userId: string;
    clientId: string;
    invoiceId: string;
    title: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
    date: string;
    notes: string;
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"));
            return <div className="font-medium text-sm whitespace-nowrap">{date.toDateString()}</div>;
        },
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            return <div className="font-medium text-sm min-w-[150px] max-w-[250px] truncate">{row.getValue("title")}</div>;
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const currency = row.original.currency;
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
            }).format(Math.abs(amount));

            return (
                <div
                    className={`text-right font-medium text-sm whitespace-nowrap ${
                        amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {amount < 0 ? "-" : "+"} {formatted}
                </div>
            );
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => {
            return <div className="text-sm whitespace-nowrap">{row.getValue("paymentMethod")}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant="outline" className="capitalize text-xs whitespace-nowrap">
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
            const notes = row.getValue("notes") as string;
            return (
                <div className="max-w-[150px] md:max-w-[200px] truncate text-sm" title={notes}>
                    {notes}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(payment._id)
                            }
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
