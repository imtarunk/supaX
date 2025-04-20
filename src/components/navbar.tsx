"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoFlame } from "react-icons/io5";
import { RiFlashlightFill } from "react-icons/ri";
import { Menu, X } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import SettingsCard from "./hoverSettingCard";
import WalletButton from "./WalletButton";
import { ClaimRewardButton } from "./ClaimRewardButton";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const DEFAULT_AVATAR = "/default-avatar.png";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  points: number;
  twitterId?: string | null;
}

const Navbar = ({ initialUser }: { initialUser: User | null }) => {
  const session = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Only run on client-side
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!session) {
    router.push("/api/auth/signin");
  }

  useEffect(() => {
    if (initialUser) {
      setPoints(initialUser.points);
    }
  }, [initialUser]);

  const isMobile = windowWidth < 768;

  return (
    <nav className="relative z-30 bg-[#0F0F0F] text-white">
      {/* Top Bar - Always visible */}
      <div className="flex items-center justify-between px-4 py-3 md:py-5">
        {/* Left side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Only show wallet button on non-mobile */}
          <div className="hidden md:block">
            <WalletButton />
          </div>

          <div className="flex items-center">
            <span className="text-lg md:text-xl font-bold">Ordzaar</span>
            <span className="hidden sm:inline md:text-xl font-bold ml-2">
              OdinSwap
            </span>
          </div>
        </div>

        {/* Right side - Mobile: Only Streak, Points, Profile; Desktop: Full Controls */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Stats that show on all screens */}
          <div className="flex items-center space-x-2">
            {/* Streak Button - Simplified on mobile */}
            <button className="relative inline-flex h-8 md:h-12 overflow-hidden rounded-full p-[1px] focus:outline-none">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center  bg-slate-950 px-2 md:px-3 py-1 md:py-3 rounded-full tracking-wide md:tracking-widest uppercase font-bold  text-white backdrop-blur-3xl">
                <IoFlame className="text-orange-500 text-2xl" />
                <span className="ml-1 md:ml-2">2</span>
              </span>
            </button>

            {/* Points Button - Simplified on mobile */}
            <button className="border border-gray-800 text-black px-2 md:px-3 py-1 md:py-3 rounded-full tracking-wide md:tracking-widest uppercase font-bold bg-transparent dark:text-neutral-200 transition duration-200 flex items-center text-sm md:text-sm">
              <RiFlashlightFill className="text-yellow-500 text-2xl" />
              <span className="ml-1">{points || 0} | XP </span>
            </button>
          </div>

          {/* Elements that only show on non-mobile screens */}
          <div className="hidden md:block">
            <ClaimRewardButton initialUser={initialUser} />
          </div>

          {/* Profile - Always visible but with different behavior */}
          <div className="flex items-center">
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer">
                  <a href="/dashboard">
                    <div className="relative w-8 h-8 md:w-10 md:h-10">
                      <Image
                        src={initialUser?.image || DEFAULT_AVATAR}
                        alt={initialUser?.name || "Profile"}
                        fill
                        sizes="(max-width: 40px) 100vw, 40px"
                        className="rounded-full object-cover hover:scale-110 transition-all duration-300 cursor-pointer z-20 border-2 border-gray-700 shadow-lg"
                        priority
                      />
                    </div>
                  </a>
                </div>
              </HoverCardTrigger>
              {/* Only show hover card on non-mobile */}
              {!isMobile && (
                <HoverCardContent className="absolute top-5 right-0 m-0 p-0 border-gray-800">
                  {initialUser && <SettingsCard user={initialUser} />}
                </HoverCardContent>
              )}
            </HoverCard>
          </div>

          {/* Mobile menu toggle button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0F0F0F] border-t border-gray-800 z-40 shadow-lg">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Wallet</p>
                <div className="mt-2">
                  <WalletButton />
                </div>
              </div>
            </div>

            <div className="py-2">
              <p className="text-sm text-gray-400 mb-2">Rewards</p>
              <ClaimRewardButton initialUser={initialUser} />
            </div>

            {initialUser && (
              <div className="py-2 border-t border-gray-800">
                <div className="pt-2">
                  <p className="text-sm text-gray-400 mb-2">Profile</p>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10">
                      <Image
                        src={initialUser?.image || DEFAULT_AVATAR}
                        alt={initialUser?.name || "Profile"}
                        fill
                        sizes="(max-width: 40px) 100vw, 40px"
                        className="rounded-full object-cover border-2 border-gray-700"
                        priority
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{initialUser?.name}</p>
                      <p className="text-xs text-gray-400">
                        {initialUser?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-gray-800">
              <a
                href="/dashboard"
                className="block py-2 text-blue-400 hover:text-blue-300"
              >
                Go to Dashboard
              </a>
              <button
                onClick={async () => {
                  try {
                    // Clear all cookies
                    document.cookie.split(";").forEach((c) => {
                      document.cookie = c
                        .replace(/^ +/, "")
                        .replace(
                          /=.*/,
                          "=;expires=" + new Date().toUTCString() + ";path=/"
                        );
                    });

                    // Clear localStorage
                    localStorage.clear();

                    // Clear sessionStorage
                    sessionStorage.clear();

                    // Sign out from NextAuth
                    await signOut({
                      callbackUrl: "/",
                      redirect: true,
                    });
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
                className="block py-2 text-red-400 hover:text-red-300 w-full text-left"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
