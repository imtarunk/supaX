import {
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import bs58 from "bs58";
import axios from "axios";

export function useClaimReward() {
  const { publicKey, signTransaction } = useWallet();

  const claimReward = async (points: number) => {
    console.log("⚡ Claiming reward...");

    const res = await axios.post("/api/user/reward", {
      points: points as number,
    });

    if (res.status === 200) {
      toast.success("🎉 Reward claimed successfully");

      if (!publicKey || !signTransaction) {
        toast.error("🔌 Please connect your wallet");
        return;
      }

      const rewardWalletPrivateKey =
        process.env.NEXT_PUBLIC_REWARD_WALLET_PRIVATE_KEY;
      if (!rewardWalletPrivateKey) {
        toast.error("⚠️ Reward wallet private key not set");
        return;
      }

      const rewardAmount = points * 0.001;
      const lamports = rewardAmount * LAMPORTS_PER_SOL;
      const rpcUrl =
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        "https://api.devnet.solana.com";
      const connection = new Connection(rpcUrl, "confirmed");

      const rewardWallet = Keypair.fromSecretKey(
        bs58.decode(rewardWalletPrivateKey)
      );
      const balance = await connection.getBalance(rewardWallet.publicKey);

      if (balance < lamports) {
        toast.error("❌ Reward wallet has insufficient funds");
        return;
      }

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: rewardWallet.publicKey,
          toPubkey: publicKey,
          lamports,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      transaction.sign(rewardWallet);
      const signedTx = await signTransaction(transaction);
      const rawTx = signedTx.serialize();

      const txSignature = await connection.sendRawTransaction(rawTx, {
        skipPreflight: false,
        maxRetries: 0,
        preflightCommitment: "confirmed",
      });

      await connection.confirmTransaction(
        { signature: txSignature, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      toast(`🎉 Claimed ${rewardAmount} SOL`);
    } else {
      toast.error("❌ Failed to claim reward");
    }
  };

  return { claimReward };
}
