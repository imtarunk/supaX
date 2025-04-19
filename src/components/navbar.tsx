"use client";

import { User } from "@prisma/client";
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
import WalletButton from "./WalletButton";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="relative z-10 flex items-center justify-between px-4 py-5 bg-[#0F0F0F] text-white mt-5">
      <div className="flex items-center space-x-4">
        {/* Logos */} <WalletButton />
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Ordzaar</span>
          <span className="text-xl font-bold">OdinSwap</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Gift Button */}
        <button className="flex items-center justify-center bg-transparent border border-red-500 rounded-lg px-3 py-1 shadow-[0_0_10px_2px_rgba(255,0,0,0.8)] animate-shake hover:animate-shake hover:scale-110 transition-all duration-300">
          <FaGift className="text-red-500 animate-slide-x w-5 h-5" />
        </button>

        {/* Streak Counter */}
        <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            <IoFlame className="text-orange-500" />
            <span>2 Day streak</span>
          </span>
        </button>

        {/* XP Display */}
        <button className=" border border-gray-800-500 text-black px-3 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent  dark:text-neutral-200 transition duration-200 flex items-center space-x-2">
          <RiFlashlightFill className="text-yellow-500" />
          <span>11,121 XP</span>
        </button>

        {/* Level Indicator */}
        <div className="flex items-center space-x-2">
          {user?.image && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer">
                  <a href="/dashboard">
                    <div className="relative w-15 h-15">
                      <Image
                        src={user.image}
                        alt={user.name || "Profile"}
                        fill
                        sizes="(max-width: 40px) 100vw, 40px"
                        className="rounded-full object-cover hover:scale-110 transition-all duration-300 cursor-pointer z-20 border-2 border-gray-700 shadow-lg"
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
