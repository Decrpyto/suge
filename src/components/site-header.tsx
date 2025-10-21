"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { ModeToggle } from "./theme-toggle";

export function SiteHeader({ title }: { title: string }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-16 md:h-20 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <div className="flex justify-between items-center w-full">
                <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />
                    <h1 className="text-2xl font-medium">{title}</h1>
                    <div className="ml-auto flex items-center gap-2" />
                </div>
                <div className="flex items-center px-6">
                    <ModeToggle />
                </div>
            </div>
        </motion.header>
    );
}
