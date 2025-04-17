import NextAuth from "next-auth/next";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
      token: {
        params: {
          include_email: true,
        },
      },
      profile: (profile) => {
        console.log("Twitter Profile:", profile);
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.email,
          image: profile.data.profile_image_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - Account:", account);
      console.log("JWT Callback - Profile:", profile);

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, user, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - User:", user);
      console.log("Session Callback - Token:", token);

      if (session.user) {
        session.user.id = user.id;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.idToken = token.idToken;
        session.expiresAt = token.expiresAt;
      }
      return session;
    },
  },
  debug: true,
});

export { handler as GET, handler as POST };
