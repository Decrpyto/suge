"use client";

import * as React from "react";

import { SugeLogo } from "@/components/suge-logo";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

// Render the app logo and name in the sidebar header, replacing the old team switcher dropdown
export function TeamSwitcher() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="hover:bg-transparent focus-visible:ring-0"
                >
                    <SugeLogo />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
