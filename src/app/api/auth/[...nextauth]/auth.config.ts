import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { handleStreak } from "@/lib/streak";
import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import type { DefaultSession, DefaultUser } from "next-auth";
import type { AdapterUser as NextAuthAdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      points: number;
      twitterId?: string | null;
    };
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  interface User extends DefaultUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    points: number;
    twitterId?: string | null;
  }
}

interface TwitterProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  data?: {
    username: string;
  };
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends NextAuthAdapterUser {
    points: number;
    twitterId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        params: {
          scope: "tweet.read users.read offline.access",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter" && profile) {
        const twitterProfile = profile as TwitterProfile;
        console.log("Twitter Profile:", twitterProfile);

        if (!twitterProfile.data?.username) {
          console.error("Twitter username is missing");
          return false;
        }

        try {
          // Use upsert to handle both create and update cases
          const updatedUser = await prisma.user.upsert({
            where: { twitterId: twitterProfile.data.username },
            update: {
              name: user.name,
              image: user.image,
            },
            create: {
              name: user.name,
              image: user.image,
              twitterId: twitterProfile.data.username,
              points: 0,
            },
          });

          console.log("Updated User:", updatedUser);

          // Handle streak after successful login
          await handleStreak(updatedUser.id);

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.points = user.points || 0;
        token.twitterId = user.twitterId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.points = token.points as number;
        session.user.twitterId = token.twitterId as string | null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/dashboard",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
