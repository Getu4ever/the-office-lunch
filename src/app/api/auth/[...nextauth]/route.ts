import NextAuth from "next-auth";
import type { NextAuthConfig, DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User { role: string; }
  interface Session {
    user: { id: string; role: string; } & DefaultSession["user"];
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await dbConnect();
        const dbUser = await User.findOne({ email: (credentials.email as string).toLowerCase() }).lean() as any;
        if (!dbUser || !dbUser.password) return null;
        const isMatch = await bcrypt.compare(credentials.password as string, dbUser.password);
        if (!isMatch) return null;
        return {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role || "customer",
          image: dbUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          // Upsert logic: updates image/name, sets role only if new
          await User.findOneAndUpdate(
            { email: user.email },
            { $set: { name: user.name, image: user.image, isVerified: true }, $setOnInsert: { role: "customer" } },
            { upsert: true }
          );
        } catch (error) { return false; }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email }).lean() as any;
        token.id = dbUser?._id.toString() || user.id;
        token.role = dbUser?.role || "customer";
        token.picture = dbUser?.image || user.image; 
      }
      if (trigger === "update" && (session?.user?.image || session?.image)) {
        token.picture = session.user?.image || session.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.picture; // Maps JWT picture to UI image
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export const { GET, POST } = handlers;