import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);

  if (!session?.user?.id) {
    console.log("No session or user ID found");
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        twitterAccount: true,
      },
    });
    console.log("User from database:", user);

    if (!user) {
      console.log("No user found in database");
      return null;
    }

    // Check if Twitter tokens are expired
    if (
      user.twitterAccount?.expiresAt &&
      new Date() > user.twitterAccount.expiresAt
    ) {
      // Attempt to refresh Twitter tokens
      try {
        const response = await fetch("https://api.twitter.com/2/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: user.twitterAccount.refreshToken,
            client_id: process.env.TWITTER_CLIENT_ID!,
          }),
        });

        const data = await response.json();

        if (data.access_token) {
          // Update user's tokens in database
          await prisma.twitterAccount.update({
            where: { userId: user.id },
            data: {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expiresAt: new Date(Date.now() + data.expires_in * 1000),
            },
          });
        }
      } catch (error) {
        console.error("Error refreshing Twitter tokens:", error);
        // If token refresh fails, we'll still return the user but they may need to re-authenticate
      }
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
