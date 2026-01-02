import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { Providers } from "./components/Providers";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKannada = Noto_Sans_Kannada({
  variable: "--font-kannada",
  subsets: ["kannada", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Parimala Geleyara Balaga",
  description: "Your trusted online bookstore for books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKannada.variable} antialiased`}
      >
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
