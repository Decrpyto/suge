"use client";

import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClerkProvider from "@/components/ConvexClerkProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import Loader from "@/components/loader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});
const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    weight: ["400", "700"],
});

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<Loader />}>
            <ClerkProvider>
                <ConvexClerkProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div
                            className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} font-sans`}
                        >
                            {children}
                        </div>
                    </ThemeProvider>
                </ConvexClerkProvider>
            </ClerkProvider>
        </Suspense>
    );
}
