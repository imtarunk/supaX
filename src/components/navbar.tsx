import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";
import { FaGift } from "react-icons/fa";
import { IoFlame } from "react-icons/io5";
import { RiFlashlightFill } from "react-icons/ri";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import SettingsCard from "./hoverSettingCard";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <nav className="relative z-10 flex items-center justify-between px-4 py-2 bg-[#0F0F0F] text-white mt-5">
      <div className="flex items-center space-x-4">
        {/* Logos */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Ordzaar</span>
          <span className="text-xl font-bold">OdinSwap</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Gift Button */}
        <button className="flex items-center justify-center bg-transparent border border-red-500 rounded-lg px-3 py-1">
          <FaGift className="text-red-500" />
        </button>

        {/* Streak Counter */}
        <div className="flex items-center space-x-2 bg-[#1A1A1A] rounded-lg px-3 py-1">
          <IoFlame className="text-orange-500" />
          <span>2 Day streak</span>
        </div>

        {/* XP Display */}
        <div className="flex items-center space-x-2">
          <RiFlashlightFill className="text-yellow-500" />
          <span>11,121 XP</span>
        </div>

        {/* Level Indicator */}
        <div className="flex items-center space-x-2">
          {user?.image && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer">
                  <a href="/dashboard">
                    <div className="relative w-10 h-10">
                      <Image
                        src={user.image}
                        alt={user.name || "Profile"}
                        fill
                        sizes="(max-width: 40px) 100vw, 40px"
                        className="rounded-full object-cover hover:scale-110 transition-all duration-300 cursor-pointer z-20"
                        priority
                      />
                    </div>
                  </a>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="absolute top-5 right-0 m-0 p-0 border-gray-800">
                <SettingsCard user={user} />
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
