import type { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { Account } from "next-auth";

// Extend the Session type to include our custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

interface TwitterProfile {
  data: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  };
}

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 15, // Twitter's rate limit for OAuth
  currentRequests: 0,
  resetTime: Date.now(),
};

// Function to check and handle rate limits
const checkRateLimit = async () => {
  const now = Date.now();

  // Reset counter if window has passed
  if (now > RATE_LIMIT.resetTime) {
    RATE_LIMIT.currentRequests = 0;
    RATE_LIMIT.resetTime = now + RATE_LIMIT.windowMs;
  }

  // If we've hit the rate limit, wait until the window resets
  if (RATE_LIMIT.currentRequests >= RATE_LIMIT.maxRequests) {
    const waitTime = RATE_LIMIT.resetTime - now;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    RATE_LIMIT.currentRequests = 0;
    RATE_LIMIT.resetTime = Date.now() + RATE_LIMIT.windowMs;
  }

  RATE_LIMIT.currentRequests++;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
      authorization: {
        params: {
          scope: "tweet.read users.read offline.access",
        },
      },
      profile: async (profile: TwitterProfile) => {
        await checkRateLimit();
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: null,
          image: profile.data.profile_image_url,
          twitterId: profile.data.id,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "twitter") {
        try {
          await checkRateLimit();

          // Check if user exists with this Twitter ID
          const existingUser = await prisma.user.findUnique({
            where: { twitterId: user.id },
          });

          if (!existingUser) {
            // Create new user with Twitter ID
            await prisma.user.create({
              data: {
                name: user.name,
                image: user.image,
                twitterId: user.id,
              },
            });
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account?.access_token) {
        try {
          await checkRateLimit();
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at;
        } catch (error) {
          console.error("Error in jwt callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        try {
          await checkRateLimit();
          session.accessToken = token.accessToken as string;
          session.refreshToken = token.refreshToken as string;
          session.expiresAt = token.expiresAt as number;
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true,
};
