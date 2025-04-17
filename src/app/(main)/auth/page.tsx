"use client";

import { Button } from "@/components/ui/button";
import XIcon from "@/components/icons/icons";
import Link from "next/link";

export default function SignIn() {
  const handleSignIn = () => {
    window.location.href = "/auth/login";
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black/90 rounded-2xl w-full max-w-sm px-6 py-10 flex-col shadow-xl border border-gray-700 flex justify-center items-center">
        <div className="mb-6">
          <XIcon />
        </div>
        <p className="text-white text-center text-lg mb-6">
          Sign in with your X account
        </p>
        <Button onClick={handleSignIn} className="w-full z-20 cursor-pointer">
          Sign in with X
        </Button>
        <Link href="/auth/login">Login</Link>
      </div>
    </div>
  );
}
