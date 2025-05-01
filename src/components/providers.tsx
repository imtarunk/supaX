"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme.provider";
import { Toaster } from "@/components/ui/sonner";
// import SparklingBackground from "@/components/ui/sparkling-backgroud";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
        {/* <SparklingBackground /> */}
      </ThemeProvider>
    </SessionProvider>
  );
}
