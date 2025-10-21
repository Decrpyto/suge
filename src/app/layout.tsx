import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Suge - Modern SaaS Solution",
    description: "Jab sb aapki le rahe ho to aap bhi khuch lelo",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                {/* All client-side providers including ThemeProvider are inside ClientLayout */}
                <ClientLayout>
                    {children}
                    <Toaster />
                </ClientLayout>
            </body>
        </html>
    );
}
