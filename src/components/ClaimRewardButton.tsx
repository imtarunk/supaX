import { useClaimReward } from "@/lib/claimReward";
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
    <button
      onClick={handleClaim}
      className="p-[3px] relative w-full hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer rounded-lg"
      disabled={!initialUser}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
        Claim {initialUser ? `${sol} SOL` : "Reward"}
      </div>
    </button>
  );
}
