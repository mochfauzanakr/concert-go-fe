import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DemoStorageSync from "@/components/demo/storage-sync";
import SessionSync from "@/components/SessionSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ConcertGo",
    default: "ConcertGo - Platform Pembelian Tiket Resmi",
  },
  description:
    "Beli tiket konser musik, festival, dan acara hiburan lainnya dengan mudah dan aman tanpa calo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SessionSync />
        <DemoStorageSync />
        {children}
      </body>
    </html>
  );
}
