import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Google_Sans,
  Google_Sans_Flex,
} from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Navbar } from "@/components/navbar";

const fallbackOne = Geist({
  variable: "--font-fallback-one",
  subsets: ["latin"],
});

const fallbackTwo = Geist_Mono({
  variable: "--font-fallback-two",
  subsets: ["latin"],
});

const geistSans = Google_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["Geist", "sans-serif"],
  adjustFontFallback: false,
});

const geistMono = Google_Sans_Flex({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["Geist Mono", "monospace"],
  adjustFontFallback: false,
});

// const geistSans = Google_Sans({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Google_Sans_Flex({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Worship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ConvexClientProvider>
          <Navbar />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
