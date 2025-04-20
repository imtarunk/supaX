"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function CallbackContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Send message to parent window
    if (window.parent && !error) {
      window.parent.postMessage("auth_success", window.location.origin);
    } else if (error) {
      window.parent?.postMessage("auth_error", window.location.origin);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {error ? "Authentication Error" : "Authentication Successful"}
        </h1>
        <p className="text-gray-600">
          {error
            ? "An error occurred during authentication. Please try again."
            : "Authentication complete. You can close this window."}
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
