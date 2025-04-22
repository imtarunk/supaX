"use client";
import React, { useEffect, useState } from "react";
import { XIcon } from "./icons/icons";
import { Loader2 } from "lucide-react";

const XConnectPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [insideWebView, setInsideWebView] = useState(false);

  useEffect(() => {
    const checkIfWebView = () => {
      // Enhanced Telegram WebView detection
      const isTelegramWebView = (() => {
        try {
          // Check for Telegram.WebApp object
          const hasTelegramWebApp =
            typeof window !== "undefined" &&
            window.Telegram &&
            window.Telegram.WebApp;

          // Check for Telegram webapp URL parameters
          const urlParams = new URLSearchParams(window.location.search);
          const hasTgWebAppData =
            urlParams.has("tgWebAppData") ||
            urlParams.has("tgWebAppVersion") ||
            urlParams.has("tgWebAppPlatform");

          // Check for Telegram in user agent (some versions)
          const userAgent = navigator.userAgent || navigator.vendor || "";
          const hasTelegramUA =
            userAgent.includes("Telegram") || userAgent.includes("TelegramBot");

          console.log("Telegram detection:", {
            hasTelegramWebApp,
            hasTgWebAppData,
            hasTelegramUA,
            searchParams: window.location.search,
          });

          return hasTelegramWebApp || hasTgWebAppData || hasTelegramUA;
        } catch (e) {
          console.error("Error checking for Telegram WebView:", e);
          return false;
        }
      })();

      const userAgent =
        typeof navigator !== "undefined"
          ? navigator.userAgent || navigator.vendor || ""
          : "";

      console.log("Current userAgent:", userAgent);

      // iOS WebView detection (more comprehensive)
      const isIOSWebView =
        /\b(iPhone|iPod|iPad)\b/.test(userAgent) &&
        (/FxiOS|CriOS|EdgiOS|GSA\/|Instagram|FB_IAB|FBAV|Line|MicroMessenger|WebKit/.test(
          userAgent
        ) ||
          !userAgent.includes("Safari") ||
          userAgent.includes("WKWebView"));

      // Android WebView detection (enhanced)
      const isAndroidWebView =
        userAgent.includes("wv") ||
        userAgent.includes("WebView") ||
        /Android.*Version\/[0-9]/.test(userAgent) ||
        (userAgent.includes("Android") &&
          (!userAgent.includes("Chrome") ||
            userAgent.includes("Instagram") ||
            userAgent.includes("FB_IAB") ||
            userAgent.includes("FBAV") ||
            userAgent.includes("Line")));

      // General webview detection
      const isOtherWebView =
        /FB_IAB|FBAV|Instagram|Line|MicroMessenger|GSA\/|WebView|Electron/.test(
          userAgent
        );

      // Forced detection for testing
      const forceWebView =
        new URLSearchParams(window.location.search).get("webview") === "true";

      // Force Telegram detection for testing
      const forceTelegram =
        new URLSearchParams(window.location.search).get("telegram") === "true";

      if (
        isTelegramWebView ||
        isIOSWebView ||
        isAndroidWebView ||
        isOtherWebView ||
        forceWebView ||
        forceTelegram
      ) {
        console.log("WebView detected:", {
          isTelegramWebView,
          isIOSWebView,
          isAndroidWebView,
          isOtherWebView,
          forceWebView,
          forceTelegram,
        });
        setInsideWebView(true);
      } else {
        console.log("Not in WebView");
      }
    };

    checkIfWebView();
  }, []);

  const handleConnect = () => {
    setIsLoading(true);
    window.location.href = "/api/auth/signin"; // or next-auth signin('twitter')
  };

  const openWebView = () => {
    // When in a webview, use Google auth instead of Twitter
    window.open("/api/auth/signin/twitter", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100">
              <XIcon width={100} height={100} />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Connect with X
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Link your X account to continue
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={insideWebView ? openWebView : handleConnect}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-black hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Connecting...
                </span>
              ) : (
                "Connect X Account"
              )}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6">
            <p>We only request basic access to your X profile</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Having trouble?{" "}
            <a
              href="#"
              className="font-medium text-blue-500 hover:text-blue-700"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default XConnectPage;
