// app/layout.tsx or wherever your root layout is

import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import Script from "next/script";

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
      <head />
      <body
        className={`${spaceMono.variable} font-mono bg-black text-white antialiased`}
      >
        <Script
          src="https://telegram.org/js/telegram-web-app.js?56"
          strategy="beforeInteractive"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
