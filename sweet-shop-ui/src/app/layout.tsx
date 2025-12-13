import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or your preferred font
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner"; // Sleek notifications

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Midnight Sweets",
  description: "Premium Confectionery Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={font.className}>
        <QueryProvider>
          {children}
          {/* sleek toast notifications */}
          <Toaster theme="dark" position="top-right" /> 
        </QueryProvider>
      </body>
    </html>
  );
}