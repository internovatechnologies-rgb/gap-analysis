import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Co-Pilot for CARF Compliance",
  description: "Theraptly’s AI instantly analyzes your policies against CARF standards so you can focus on care, not paperwork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden flex flex-col bg-gray-50`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
