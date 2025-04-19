import { useClaimReward } from "@/lib/claimReward";
import { Button } from "./ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";

interface User {
  points: number;
  // Add other user properties as needed
}

export function ClaimRewardButton() {
  const { claimReward } = useClaimReward();
  const { user } = useCurrentUser();

  const handleClaim = async () => {
    const typedUser = user as User | null;
    if (!typedUser?.points) {
      toast.error("No points available to claim");
      return;
    }

    try {
      await claimReward(typedUser.points);
    } catch (error) {
      console.error("Failed to claim reward:", error);
    }
  };

  return (
    <Button onClick={handleClaim} className="w-full" disabled={!user}>
      Claim {user ? `${(user as User).points * 0.001} SOL` : "Reward"}
    </Button>
  );
}
