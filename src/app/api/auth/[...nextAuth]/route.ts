import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn(params) {
      const { account, user, credentials, profile } = params;

      const userObj = {};
      switch (account?.type) {
        case "credentials":
          break;
        case "oauth":
          break;
        default:
          break;
      }
      return true;
    },
  },
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
