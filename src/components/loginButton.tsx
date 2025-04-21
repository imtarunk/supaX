"use client";

import { isTelegramWebApp } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function TwitterLoginButton() {
  console.log("isTelegramWebApp", isTelegramWebApp());
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = () => {
    setIsLoading(true);
    console.log("handleLogin-------------------------------------------");
    const loginUrl = "/api/auth/signin"; // replace with your actual login route

    if (isTelegramWebApp()) {
      window.Telegram.WebApp.openLink(loginUrl);
    } else {
      window.location.href = loginUrl;
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-black hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
    >
      {" "}
      {isLoading ? (
        <span className="flex items-center">
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          Connecting...
        </span>
      ) : (
        "Connect X Account"
      )}
    </button>
  );
}
