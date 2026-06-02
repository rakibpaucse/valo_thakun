import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter_Tight, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { NextAuthSessionProvider } from "@/components/session-provider";
import { RouteProgress } from "@/components/route-progress";
import { PageTransition } from "@/components/page-transition";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

// Brand wordmark — modern geometric sans
const brand = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Valo Thakun — Care, considered.",
    template: "%s · Valo Thakun",
  },
  description:
    "Valo Thakun (ভালো থাকুন) — a multi-doctor medical practice in Dhaka. Cardiology, dermatology, pediatrics, psychiatry, orthopedics. Book online in 60 seconds.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} ${brand.variable} font-sans`}>
        <NextAuthSessionProvider>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          <Suspense fallback={null}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
          <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
