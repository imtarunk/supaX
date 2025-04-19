import type { NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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

// Extend AdapterUser to include our custom fields
interface CustomAdapterUser extends Omit<AdapterUser, "id"> {
  twitterId?: string;
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

// Custom adapter to handle user creation
const customAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data: CustomAdapterUser) => {
    try {
      // First try to find the user by twitterId
      const existingUser = await prisma.user.findUnique({
        where: { twitterId: data.twitterId || "" },
      });

      if (existingUser) {
        // If user exists, update their information
        return prisma.user.update({
          where: { twitterId: data.twitterId || "" },
          data: {
            name: data.name,
            image: data.image,
            email: data.email || "",
          },
        }) as Promise<AdapterUser>;
      }

      // If user doesn't exist, create a new one
      return prisma.user.create({
        data: {
          name: data.name,
          image: data.image,
          twitterId: data.twitterId || "",
          email: data.email || "",
        },
      }) as Promise<AdapterUser>;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customAdapter,
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
    async jwt({ token, account }) {
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
    async session({ session, token }) {
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
    async redirect({ url, baseUrl }) {
      // If the URL is relative, prepend the base URL
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // If the URL is from the same origin, allow it
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
