"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/user/getuser");
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setLoading(false);
    }

    fetchUser();
  }, [session]);

  return { user, loading };
}
