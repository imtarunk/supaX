"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [isTelegram, setIsTelegram] = useState(false);
  const [inTelegram, setInTelegram] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.initData) {
      setInTelegram(true);
      setIsTelegram(true);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("auth_token", token);
    }
  }, []);

  const handleLogin = () => {
    const url =
      "https://supax.codextarun.xyz/api/auth/signin?callbackUrl=" +
      encodeURIComponent(callbackUrl);
    window.open(url, "_blank"); // open login in external browser
  };

  if (inTelegram) {
    handleLogin();
  }

  useEffect(() => {
    const handleSignIn = async () => {
      console.log("Sign-in flow starting...", {
        isTelegram,
        callbackUrl,
        error,
      });

      if (!error && !isTelegram) {
        try {
          const result = await signIn("twitter", {
            callbackUrl,
            redirect: false,
          });

          console.log("Sign-in result:", result);

          if (result?.ok && result?.url) {
            window.location.href = result.url;
          } else {
            console.error("Failed sign in:", result);
          }
        } catch (err) {
          console.error("Error during sign in:", err);
        }
      } else if (
        error === "OAuthCallback" &&
        retryCount < maxRetries &&
        !isTelegram
      ) {
        console.log(`Retrying sign-in (${retryCount + 1}/${maxRetries})...`);
        await new Promise((res) => setTimeout(res, 5000));
        setRetryCount((prev) => prev + 1);
      }

      setIsLoading(false);
    };

    handleSignIn();
  }, [callbackUrl, error, retryCount, isTelegram]);

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
                ? `Rate limit hit. Retrying... (${
                    retryCount + 1
                  }/${maxRetries})`
                : "Too many retries. Try again later."
              : error === "OAuthAccountNotLinked"
              ? "This Twitter account is not linked to a user. Try a different login method."
              : "Unknown error occurred."}
          </p>
          <div className="space-y-4">
            {retryCount >= maxRetries && (
              <button
                onClick={() => {
                  setRetryCount(0);
                  signIn("twitter", { callbackUrl });
                }}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Try Again
              </button>
            )}
            <Link href="/" className="block text-blue-500 hover:underline">
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

        {inTelegram && (
          <>
            <p className="mt-4 text-red-600 font-semibold">
              Twitter login is not supported inside Telegram.
            </p>
            <p className="mt-2">Tap below to open in your browser 👇</p>
            <button
              onClick={() => handleLogin()}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Login via Twitter
            </button>
          </>
        )}

        {isLoading && (
          <div className="mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {!inTelegram && !error && (
          <p className="mt-6 text-green-600">
            You&apos;re in a supported browser 🚀
          </p>
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
