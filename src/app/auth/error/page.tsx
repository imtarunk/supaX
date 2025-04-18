"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-red-600 mb-4">
          {error === "OAuthSignin"
            ? "Error signing in with Twitter. Please try again."
            : "An error occurred during authentication."}
        </p>
        <a
          href="/auth/signin"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Try again
        </a>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
