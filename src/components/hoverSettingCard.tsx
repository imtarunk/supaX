"use client";

import { signOut } from "next-auth/react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  points: number;
  twitterId?: string | null;
};

const SettingsCard = ({ user }: { user: User }) => {
  const handlelogout = async () => {
    try {
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
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

      toast.success("Logged out successfully");
    } catch (error: unknown) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };
  return (
    <div className="bg-black rounded-lg max-w-lg m-0 p-0">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-2">
        <h1 className="text-xm font-normal">Settings</h1>
      </div>

      {/* Horizontal line */}
      <div className="border-t border-gray-800 mb-10"></div>

      {/* Profile section */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-white rounded-full p-4 mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.665 3.717L2.93497 10.554C1.72497 11.04 1.73997 11.715 2.71497 12.016L7.26497 13.436L17.797 6.791C18.295 6.488 18.75 6.651 18.376 6.983L9.84297 14.684H9.84097L9.84297 14.685L9.52897 19.377C9.98897 19.377 10.192 19.166 10.45 18.917L12.661 16.767L17.26 20.164C18.108 20.631 18.717 20.391 18.928 19.379L21.947 5.151C22.256 3.912 21.474 3.351 20.665 3.717Z"
              fill="black"
            />
          </svg>
        </div>
        <div className="text-xl font-medium">{user?.name}</div>
      </div>

      {/* Horizontal line */}
      <div className="border-t border-gray-800 mb-8"></div>
      {/* Twitter/X Account */}
      <div className="flex flex-col justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>{user?.twitterId}</span>
        </div>
        <div className="h-4"></div>
        <button
          className="bg-transparent border border-green-400 text-green-400 hover:bg-green-400/10 px-6 py-2 rounded-lg font-medium mb-5"
          onClick={handlelogout}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsCard;
