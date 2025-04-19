import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return null;
    }

    // Check if tokens are expired
    if (user.tokenExpires && user.tokenExpires < new Date()) {
      if (user.refreshToken) {
        try {
          // Refresh the tokens
          const tokenResponse = await fetch(
            `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                grant_type: "refresh_token",
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                refresh_token: user.refreshToken,
              }),
            }
          );

          const tokens = await tokenResponse.json();
          console.log("Tokens refreshed:", tokens);

          // Calculate new expiration time
          const tokenExpires = new Date();
          tokenExpires.setSeconds(
            tokenExpires.getSeconds() + tokens.expires_in
          );

          // Update user with new tokens
          const updatedUser = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              accessToken: tokens.access_token,
              idToken: tokens.id_token,
              refreshToken: tokens.refresh_token,
              tokenExpires: tokenExpires,
            },
          });

          console.log("User tokens updated:", updatedUser);
          return updatedUser;
        } catch (error) {
          console.error("Error refreshing tokens:", error);
          return null;
        }
      }
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
