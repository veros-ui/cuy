import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        if (!c?.email || !c.password) return null;
        const u = await prisma.user.findUnique({ where: { email: String(c.email).toLowerCase() } });
        if (!u?.password || !(await bcrypt.compare(String(c.password), u.password))) return null;
        return { id: u.id, name: u.name, email: u.email, role: u.role };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      if (user.email && user.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
        await prisma.user.update({ where: { email: user.email }, data: { role: "ADMIN" } }).catch(() => {});
        user.role = "ADMIN";
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user?.id) token.id = user.id;
      // Keep the JWT small. Never put the profile avatar/data URL in the cookie.
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, name: true },
        }).catch(() => null);
        if (dbUser) Object.assign(token, { role: dbUser.role, name: dbUser.name });
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        Object.assign(session.user, { id: token.id, role: token.role, name: token.name });
        // Profile fields come from the DB in the session response, not the JWT.
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { image: true, bio: true, avatarBorder: true },
          }).catch(() => null);
          if (dbUser) Object.assign(session.user, dbUser);
        }
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

export const handler = NextAuth(authOptions as any);
