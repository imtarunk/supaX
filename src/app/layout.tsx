// app/layout.tsx or wherever your root layout is

import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme.provider";
import SparklingBackground from "@/components/ui/sparkling-backgroud";
import { Toaster } from "@/components/ui/sonner";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "SuperFi",
  description:
    "Supercharge your crypto community with automated engagement tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} font-mono bg-black text-white antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SparklingBackground />
        </ThemeProvider>
      </body>
    </html>
  );
}
