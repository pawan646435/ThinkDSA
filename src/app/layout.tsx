// src/app/layout.tsx
// Root layout with dark theme, Google Fonts, and global styles

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ThinkDSA — Interactive DSA Learning Platform",
  description:
    "Master Data Structures & Algorithms with step-by-step visualizations, interactive coding, practice problems, and AI-powered explanations.",
  keywords: [
    "DSA",
    "Data Structures",
    "Algorithms",
    "Binary Search",
    "Stack",
    "Visualization",
    "Learning",
    "Interactive",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#050510] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
