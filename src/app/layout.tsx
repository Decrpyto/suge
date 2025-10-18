import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
    title: "Suge - Modern SaaS Solution",
    description: "Jab sb aapki le rahe ho to aap bhi khuch lelo",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ClientLayout>{children}</ClientLayout>;
}
