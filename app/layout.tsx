import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "MDFLD | Elite Streetwear & Performance Gear",
    template: "%s | MDFLD", // Automatically formats page titles like "Shop | MDFLD"
  },
  description: "Join the elite. Discover exclusive drops, high-performance streetwear, and blockchain-verified gear. Dominate the midfield.",
  keywords: ["streetwear", "performance apparel", "techwear", "exclusive drops", "MDFLD", "urban fashion", "members only"],
  authors: [{ name: "MDFLD" }],
  creator: "MDFLD",
  metadataBase: new URL("https://mdfld.com"), // Replace with your actual domain
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MDFLD | Elite Streetwear",
    description: "Join the elite. Discover exclusive drops and high-performance streetwear.",
    siteName: "MDFLD",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1200&h=630&auto=format&fit=crop", // Using your atmospheric stadium background
        width: 1200,
        height: 630,
        alt: "MDFLD Exclusive Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MDFLD | Elite Streetwear",
    description: "Join the elite. Discover exclusive drops and high-performance streetwear.",
    images: ["https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1200&h=630&auto=format&fit=crop"],
    creator: "@mdfld", // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020606", // Matches your app's dark background color for mobile browsers
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}