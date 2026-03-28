import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Define the shape of your database user to stop TypeScript errors
interface IUser {
  _id: any;
  email: string;
  password?: string;
  name?: string;
  role?: string;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await connectDB();
        
        // Use lean() for performance, cast to IUser to fix property errors
        const user = await User.findOne({ email: credentials.email }).lean() as IUser | null;

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        // String() ensures bcrypt receives the correct type
        const isPasswordOk = await bcrypt.compare(
          String(credentials.password), 
          String(user.password)
        );

        if (!isPasswordOk) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || 'User',
          role: user.role || 'customer',
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        // Type assertion to allow custom properties on the session object
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  session: { 
    strategy: "jwt" as const 
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };