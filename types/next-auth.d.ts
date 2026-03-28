import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      image?: string; // Explicitly add image for Cloudinary support
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    picture?: string; // JWT uses 'picture' instead of 'image' by default
  }
}