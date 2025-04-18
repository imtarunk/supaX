// app/layout.tsx or wherever your root layout is

import WalletProviderWrapper from "@/components/WalletProviderWrapper";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProviderWrapper>{children}</WalletProviderWrapper>
      </body>
    </html>
  );
}
