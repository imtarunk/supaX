"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Send success message to opener window
    if (window.opener && !error) {
      window.opener.postMessage("auth_success", window.location.origin);
      window.close();
    } else if (error) {
      window.opener?.postMessage("auth_error", window.location.origin);
      window.close();
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
            : "You can close this window and return to the app."}
        </p>
      </div>
    </div>
  );
}
