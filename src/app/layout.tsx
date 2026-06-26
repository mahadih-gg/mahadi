import AppProviders from "@/components/app-providers";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Space_Grotesk, Syne, Unbounded } from "next/font/google";
import "./globals.css";

/** Bio, descriptions, nav */
const fontBody = Space_Grotesk({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["300"],
});

/** Name, section headers */
const fontHeading = Syne({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["700"],
});

/** Hero statements, bold accents */
const fontDisplay = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${fontBody.variable} ${fontHeading.variable} ${fontDisplay.variable} antialiased`}
      >
        <AppProviders>
          <Navbar />
          {children}

          <div className="fixed bottom-5 right-5 opacity-40">
            <p className="py-2 px-5 font-semibold bg-primary text-primary-foreground rounded-full">In Development</p>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
