"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Cek apakah path sekarang diawali "/dashboard"
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body>
        {/* Navbar hanya muncul di luar dashboard */}
        {!isDashboard && <Navbar />}

        <main>{children}</main>
      </body>
    </html>
  );
}
