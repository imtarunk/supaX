"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const handleSignIn = async () => {
      console.log("Starting sign in process...");
      console.log("Callback URL:", callbackUrl);

      // Check if we're in Telegram's in-app browser
      const isTelegramBrowser = /Telegram/.test(navigator.userAgent);

      if (!error) {
        try {
          console.log("Initiating Twitter sign in...");
          const result = await signIn("twitter", {
            callbackUrl,
            redirect: false,
          });

          if (result?.ok) {
            if (isTelegramBrowser) {
              // For Telegram browser, we need to handle the redirect differently
              window.location.href = result.url || callbackUrl;
            } else {
              router.push(callbackUrl);
            }
          }
        } catch (error) {
          console.error("Error during sign in:", error);
        }
      } else if (error === "OAuthCallback" && retryCount < maxRetries) {
        console.log(
          `Retrying sign in (attempt ${retryCount + 1}/${maxRetries})...`
        );
        // Wait for 5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setRetryCount((prev) => prev + 1);
        const result = await signIn("twitter", {
          callbackUrl,
          redirect: false,
        });

        if (result?.ok) {
          if (isTelegramBrowser) {
            window.location.href = result.url || callbackUrl;
          } else {
            router.push(callbackUrl);
          }
        }
      }
      setIsLoading(false);
    };

    handleSignIn();
  }, [callbackUrl, error, retryCount, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-600 mb-4">
            {error === "OAuthSignin"
              ? "Error signing in with Twitter. Please try again."
              : error === "OAuthCallback"
              ? retryCount < maxRetries
                ? `Rate limit reached. Retrying in 5 seconds... (${
                    retryCount + 1
                  }/${maxRetries})`
                : "Too many requests. Please try again later."
              : error === "OAuthAccountNotLinked"
              ? "This Twitter account is not linked to any user. Please try signing in with a different account."
              : "An error occurred during authentication."}
          </p>
          <div className="space-y-4">
            {retryCount >= maxRetries && (
              <button
                onClick={() => {
                  setRetryCount(0);
                  signIn("twitter", { callbackUrl });
                }}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            )}
            <Link
              href="/"
              className="block text-blue-500 hover:text-blue-700 underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Signing in...</h1>
        <p className="text-gray-600 mb-4">
          Please wait while we redirect you to Twitter.
        </p>
        {isLoading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
