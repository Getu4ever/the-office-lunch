import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"; 
import dbConnect from "./lib/mongodb";
import User from "./models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. DYNAMIC TRUST: Essential for switching between Local and Vercel
  trustHost: true,
  
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, 
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        
        if (!user || !user.password) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );

        if (isPasswordCorrect) {
          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email,
            image: user.image || "", 
            role: user.role || "customer"
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;
        token.picture = user.image;
      }
      
      if (trigger === "update" && session?.image) {
        token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "customer",
              isVerified: true,
            });
          }
        } catch (error) {
          console.error("GOOGLE_SIGNIN_DB_ERROR:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  // Ensure this is set in both .env.local and Vercel
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});