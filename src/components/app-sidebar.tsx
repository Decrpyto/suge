"use client";

import * as React from "react";
import {
    AudioWaveform,
    BanknoteArrowUp,
    BookOpen,
    Bot,
    ClipboardClock,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    NotepadText,
    PencilRuler,
    PieChart,
    Settings2,
    SquareTerminal,
    Users2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: "Proposals",
            url: "#",
            icon: PencilRuler,
        },
        {
            title: "Earnings Tracker",
            url: "#",
            icon: BanknoteArrowUp,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
        },
    ],
    tools: [
        {
            name: "Invoice Generator",
            url: "#",
            icon: NotepadText,
        },
        {
            name: "Client Management",
            url: "#",
            icon: Users2,
        },
        {
            name: "Hourly Rate Calculator",
            url: "#",
            icon: ClipboardClock,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.tools} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
