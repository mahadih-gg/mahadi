import type { Metadata } from "next";
import { Potta_One, PT_Sans } from "next/font/google";
import AppProviders from "@/components/app-providers";
import UnderwaterNav from "@/components/underwater-nav";
import "./globals.css";

const primary = PT_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const secondary = Potta_One({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Mahadi Hasan",
  description: "Lead Front-end Engineer · Building performant, accessible UIs with React, Next.js & TypeScript · Based in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${primary.variable} ${secondary.variable} antialiased`}
      >
        <AppProviders>
          <UnderwaterNav />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
