import {
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  SignatureResult,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import bs58 from "bs58";

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30 seconds timeout

export function useClaimReward() {
  const { publicKey, signTransaction } = useWallet();

  const claimReward = async (points: number) => {
    try {
      if (!publicKey || !signTransaction) {
        toast.error("Please connect your wallet first");
        return;
      }

      // Load reward wallet private key from environment variable
      const rewardWalletPrivateKey =
        process.env.NEXT_PUBLIC_REWARD_WALLET_PRIVATE_KEY;
      if (!rewardWalletPrivateKey) {
        toast.error("Reward wallet not configured");
        return;
      }

      // Convert points to SOL (1 point = 0.0001 SOL)
      const rewardAmount = points * 0.0001;
      const rewardAmountLamports = Math.floor(rewardAmount * LAMPORTS_PER_SOL);

      // Create connection to Solana network
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
          "https://api.devnet.solana.com"
      );

      // Create reward wallet keypair
      let rewardWallet;
      try {
        rewardWallet = Keypair.fromSecretKey(
          bs58.decode(rewardWalletPrivateKey)
        );
        console.log(
          "Reward wallet public key:",
          rewardWallet.publicKey.toString()
        );
      } catch (error) {
        console.error("Error creating reward wallet:", error);
        toast.error("Invalid reward wallet configuration");
        return;
      }

      // Check if reward wallet has enough balance
      try {
        const rewardWalletBalance = await connection.getBalance(
          rewardWallet.publicKey
        );
        console.log(
          "Reward wallet balance:",
          rewardWalletBalance / LAMPORTS_PER_SOL,
          "SOL"
        );

        if (rewardWalletBalance < rewardAmountLamports) {
          toast.error(
            `Reward wallet has insufficient balance. Required: ${rewardAmount} SOL, Available: ${
              rewardWalletBalance / LAMPORTS_PER_SOL
            } SOL`
          );
          return;
        }
      } catch (error) {
        console.error("Error checking reward wallet balance:", error);
        toast.error("Failed to check reward wallet balance");
        return;
      }

      // Set recent blockhash
      let retryCount = 0;
      let lastError: Error | null = null;

      while (retryCount < MAX_RETRIES) {
        try {
          const { blockhash } = await connection.getLatestBlockhash();

          // Create transaction
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: rewardWallet.publicKey,
              toPubkey: publicKey,
              lamports: rewardAmountLamports,
            })
          );

          // Set transaction properties
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = publicKey; // Set fee payer to user's wallet

          // Sign transaction with user's wallet first
          let signedTransaction;
          try {
            console.log("Attempting to sign transaction with user's wallet...");
            signedTransaction = await signTransaction(transaction);
            if (!signedTransaction) {
              throw new Error("Failed to sign transaction with user's wallet");
            }
            console.log("Transaction signed successfully with user's wallet");
          } catch (signError) {
            console.error("Error signing with user's wallet:", signError);
            throw new Error(
              "Failed to sign transaction with your wallet. Please try again."
            );
          }

          // Sign with reward wallet
          try {
            console.log("Attempting to sign transaction with reward wallet...");
            signedTransaction.sign(rewardWallet);
            console.log("Transaction signed successfully with reward wallet");
          } catch (signError) {
            console.error("Error signing with reward wallet:", signError);
            throw new Error("Failed to sign transaction with reward wallet");
          }

          // Send transaction with timeout
          console.log("Sending transaction...");
          const signature = await Promise.race([
            connection.sendRawTransaction(signedTransaction.serialize()),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Transaction timeout")),
                TIMEOUT_MS
              )
            ),
          ]);

          // Confirm transaction with timeout
          console.log("Confirming transaction...");
          const confirmation = (await Promise.race([
            connection.confirmTransaction(signature as string, "confirmed"),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Confirmation timeout")),
                TIMEOUT_MS
              )
            ),
          ])) as { value: SignatureResult };

          if (confirmation.value.err) {
            throw new Error("Transaction failed");
          }

          // Update user points after successful transaction
          console.log("Updating user points...");
          const response = await fetch("/api/user/update-points", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              points: -points, // Deduct points
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update points");
          }

          toast.success(`Successfully claimed ${rewardAmount} SOL!`);
          return;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.error("Transaction attempt error:", lastError);

          if (
            lastError.message.includes("expired") ||
            lastError.message.includes("timeout") ||
            lastError.message.includes("sign") ||
            lastError.message.includes("WalletSignTransactionError")
          ) {
            retryCount++;
            if (retryCount < MAX_RETRIES) {
              console.log(
                `Retrying transaction (attempt ${
                  retryCount + 1
                }/${MAX_RETRIES})...`
              );
              // Wait a bit before retrying
              await new Promise((resolve) => setTimeout(resolve, 2000));
              continue;
            }
          } else {
            throw lastError;
          }
        }
      }

      throw lastError || new Error("Transaction failed after multiple retries");
    } catch (error) {
      console.error("Claim reward error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to claim reward. Please try again later.";
      toast.error(errorMessage);
    }
  };

  return { claimReward };
}
