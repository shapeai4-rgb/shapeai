// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) throw new Error("Invalid credentials");
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.hashedPassword) throw new Error("Invalid credentials");
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isPasswordCorrect) throw new Error("Invalid credentials");
        return user;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Этот колбэк обогащает JWT токен данными сразу после входа
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tokenBalance = user.tokenBalance ?? 0;
      }
      return token;
    },
    // Этот колбэк обогащает объект сессии данными из JWT и БД
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        
        // ★★★ КЛЮЧЕВОЙ ШАГ: Получаем самый свежий баланс из БД ★★★
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { tokenBalance: true },
        });

        // Записываем актуальный баланс в сессию, которая уйдет на клиент
        session.user.tokenBalance = dbUser?.tokenBalance ?? 0;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};