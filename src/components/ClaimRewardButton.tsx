import { useClaimReward } from "@/lib/claimReward";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  points: number;
  twitterId?: string | null;
}

export function ClaimRewardButton({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const { claimReward } = useClaimReward();
  const currentUser = useCurrentUser();

  const handleClaim = async () => {
    try {
      if (!currentUser) {
        toast("No points available to claim");
        return;
      }
      console.log(currentUser);
      await claimReward(initialUser?.points || 0);
    } catch (error) {
      console.error("Failed to claim reward:", error);
    }
  };
  const sol = Math.round((initialUser?.points || 0) * 0.001);

  return (
    <Button
      onClick={handleClaim}
      className="w-full hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer "
      disabled={!initialUser}
    >
      Claim {initialUser ? `${sol} SOL` : "Reward"}
    </Button>
  );
}
