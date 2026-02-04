"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <Header onMenuClick={() => setIsSidebarOpen(true)} />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}