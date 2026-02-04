import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Layout from "@/components/layout/Layout";
import { auth } from "@/auth";
import { PWAProvider } from "@/components/pwa/PWAProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// PWA Metadata
export const metadata: Metadata = {
  title: "DPE Inventory Management System",
  description: "Manage your inventory efficiently with this cross-platform application. Track items, stock movements, suppliers, and generate reports.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DPE Inventory",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "DPE Inventory Management System",
    title: "DPE Inventory Management System",
    description: "Manage your inventory efficiently",
  },
  twitter: {
    card: "summary",
    title: "DPE Inventory Management System",
    description: "Manage your inventory efficiently",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

// Viewport configuration for PWA
export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="DPE Inventory" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DPE Inventory" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || ""} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || ""} />
        
        {/* Prefetch critical routes */}
        <link rel="prefetch" href="/items" />
        <link rel="prefetch" href="/stock-in" />
        <link rel="prefetch" href="/stock-out" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        
        {/* Splash screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.svg"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <PWAProvider>
            <Layout session={session}>
              {children}
            </Layout>
          </PWAProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
