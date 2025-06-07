"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/app/components/layout/NavbarWrapper";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          <div className="flex flex-col min-h-screen">
            {/* Navbar is imported as a client component to avoid hydration issues */}
            <div className="sticky top-0 z-50">
              <NavbarWrapper />
            </div>
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
