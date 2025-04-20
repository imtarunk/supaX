import type { NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Extend the Session type to include our custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      twitterId?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    twitterId?: string;
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
  id?: string;
}

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
            email: data.email || null,
          },
        }) as Promise<AdapterUser>;
      }

      // If user doesn't exist, create a new one
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          image: data.image,
          twitterId: data.twitterId || "",
          email: data.email || null,
          points: 0,
        },
      });

      // Create TwitterAccount for the new user
      await prisma.twitterAccount.create({
        data: {
          userId: newUser.id,
          twitterId: data.twitterId || "",
          accessToken: "",
          refreshToken: "",
          expiresAt: new Date(),
        },
      });

      return newUser as AdapterUser;
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
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      if (user) {
        token.id = user.id;
        token.twitterId = (user as CustomAdapterUser).twitterId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.twitterId = token.twitterId as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.expiresAt = token.expiresAt as number;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
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
