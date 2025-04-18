"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ReactNode } from "react";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

export default function WalletProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConnectionProvider
      endpoint={
        "https://solana-devnet.g.alchemy.com/v2/IAF1DSxpwE1ZKom4NwQizksxb00mRb5M"
      }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {/* <WalletDisconnectButton /> */}
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
