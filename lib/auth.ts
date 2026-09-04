import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // Use database sessions so the browser cookie stays tiny and profile data
  // (including avatars) can never inflate the request headers.
  session: { strategy: "database" as const },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        if (!c?.email || !c.password) return null;
        const u = await prisma.user.findUnique({
          where: { email: String(c.email).toLowerCase() },
        });
        if (!u?.password || !(await bcrypt.compare(String(c.password), u.password))) return null;
        return { id: u.id, name: u.name, email: u.email, role: u.role };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      if (user.email && user.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
        await prisma.user
          .update({ where: { email: user.email }, data: { role: "ADMIN" } })
          .catch(() => {});
        user.role = "ADMIN";
      }
      return true;
    },
    async session({ session, user }: any) {
      if (session.user && user) {
        Object.assign(session.user, {
          id: user.id,
          role: user.role,
          name: user.name,
          image: user.image,
          bio: user.bio,
          avatarBorder: user.avatarBorder,
        });
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

export const handler = NextAuth(authOptions as any);
