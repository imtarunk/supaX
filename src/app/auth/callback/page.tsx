"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const isTelegram = searchParams.get("telegram") === "true";
  const returnTo = searchParams.get("returnTo");
  const router = useRouter();

  useEffect(() => {
    // Check if we're in Twitter's browser
    const isTwitterBrowser = /Twitter/.test(navigator.userAgent);
    console.log("Browser detection:", {
      userAgent: navigator.userAgent,
      isTwitterBrowser,
    });

    const handleCallback = async () => {
      console.log("Handling callback:", {
        error,
        isTelegram,
        returnTo,
        currentUrl: window.location.href,
      });

      if (isTwitterBrowser) {
        try {
          console.log("Detected Twitter browser, initiating automatic login");
          const result = await signIn("twitter", {
            callbackUrl: returnTo || "/dashboard",
            redirect: false,
          });
          console.log("Auto-login result:", result);

          if (result?.ok) {
            const telegramReturnUrl = `https://t.me/SupaX_bot/app?startapp=${encodeURIComponent(
              returnTo || "/dashboard"
            )}`;
            console.log(
              "Login successful, redirecting to Telegram:",
              telegramReturnUrl
            );
            window.location.href = telegramReturnUrl;
          }
        } catch (error) {
          console.error("Error during auto-login:", error);
        }
      } else if (!error) {
        if (isTelegram && window.Telegram?.WebApp) {
          try {
            const telegramReturnUrl = `https://t.me/SupaX_bot/app?startapp=${encodeURIComponent(
              returnTo || "/dashboard"
            )}`;
            console.log("Redirecting to Telegram:", telegramReturnUrl);

            // Create a temporary link element to return to Telegram
            const link = document.createElement("a");
            link.href = telegramReturnUrl;

            // Add a small delay to ensure logs are visible
            setTimeout(() => {
              link.click();
            }, 500);

            // Show a message to the user
            document.body.innerHTML = `
              <div class="flex min-h-screen items-center justify-center">
                <div class="text-center max-w-md px-4">
                  <h1 class="text-2xl font-bold mb-4">Authentication Successful!</h1>
                  <p class="text-gray-600 mb-4">
                    Returning to Telegram app...
                  </p>
                  <p class="text-sm text-gray-500">
                    If you're not redirected automatically, 
                    <a href="${telegramReturnUrl}" class="text-blue-500 hover:text-blue-700">
                      click here
                    </a>
                  </p>
                </div>
              </div>
            `;
          } catch (error) {
            console.error("Error handling Telegram return:", error);
          }
        } else {
          // Regular browser flow
          console.log("Regular browser redirect to:", returnTo || "/dashboard");
          router.push(returnTo || "/dashboard");
        }
      } else {
        console.error("Authentication error:", error);
      }
    };

    handleCallback();
  }, [error, isTelegram, returnTo, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-bold mb-4">
          {error ? "Authentication Error" : "Authentication Successful"}
        </h1>
        <p className="text-gray-600 mb-4">
          {error
            ? "An error occurred during authentication. Please try again."
            : isTelegram
            ? "Returning to Telegram..."
            : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
