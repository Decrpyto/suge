"use client";

import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser() {
    const { isSignedIn, user } = useUser();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                    {isSignedIn ? (
                        <>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonTrigger: "h-8 w-8 rounded-lg",
                                        userButtonPopoverCard: "w-56",
                                        userButtonPopoverActionButton: "w-full",
                                        userButtonPopoverActionButtonIcon:
                                            "size-4",
                                        userButtonPopoverActionButtonText:
                                            "text-sm",
                                    },
                                }}
                            />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user?.fullName || user?.username || "User"}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    manage profile
                                </span>
                            </div>
                        </>
                    ) : (
                        <SignInButton>
                            <div className="h-8 w-8 rounded-lg border flex items-center justify-center text-xs">
                                Sign in
                            </div>
                        </SignInButton>
                    )}
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
