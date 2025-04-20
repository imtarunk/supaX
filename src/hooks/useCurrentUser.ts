"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { User } from "@prisma/client";

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch user data"
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refresh = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refresh };
}
