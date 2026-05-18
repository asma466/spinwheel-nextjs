import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) throw new Error("Email is required");

        const user = await prisma.employee.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) throw new Error("User not found");

        const role = (user.role ?? "USER").toUpperCase();
        const name = user.name ?? "";

        // Admin login must have password
        if (role === "ADMIN") {
          if (!credentials?.password) throw new Error("Password required for admin");
          if (!user.password) throw new Error("Admin password not set");
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error("Incorrect password");
        }

        // User login can skip password (optional)
        if (role === "USER" && credentials?.password) {
          throw new Error("Password not required for regular users");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role,
          name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
