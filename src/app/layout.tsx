import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Layout from "@/components/layout/Layout";
import { auth } from "@/auth";
import { PWAProvider } from "@/components/pwa/PWAProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Optimize font loading with display swap
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// PWA Metadata
export const metadata: Metadata = {
  title: "DPE Store Management System",
  description: "Manage your store efficiently with this cross-platform application. Track items, stock movements, suppliers, and generate reports.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DPE Store",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "DPE Store Management System",
    title: "DPE Store Management System",
    description: "Manage your store efficiently",
  },
  twitter: {
    card: "summary",
    title: "DPE Store Management System",
    description: "Manage your store efficiently",
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
        {/* Preconnect to critical resources */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || ""} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || ""} />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="DPE Inventory" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DPE Inventory" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Prefetch critical routes */}
        <link rel="prefetch" href="/items" as="fetch" crossOrigin="anonymous" />
        <link rel="prefetch" href="/stock-in" as="fetch" crossOrigin="anonymous" />
        <link rel="prefetch" href="/stock-out" as="fetch" crossOrigin="anonymous" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        
        {/* Preload critical SVG icons */}
        <link rel="preload" href="/icons/icon-192x192.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/icon-512x512.svg" as="image" type="image/svg+xml" />
        
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
          <ThemeProvider>
            <PWAProvider>
              <Layout session={session}>
                {children}
              </Layout>
            </PWAProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
