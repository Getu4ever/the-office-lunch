import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; // Using default import to match auth.ts

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user with valid, non-expired code
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() }, // Uses Date object for MongoDB compatibility
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Update verification status
    // We set BOTH fields to ensure compatibility with Credentials and OAuth
    user.isVerified = true;
    user.emailVerified = new Date(); 
    
    // Clear the security sensitive fields
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully. You can now login." }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("VERIFICATION_ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}