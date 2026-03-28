import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Find user with valid, non-expired reset code
    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: new Date() }, // Must be in the future
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired recovery code" },
        { status: 400 }
      );
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update user and CLEAR the reset fields for security
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    
    // Also ensure they are marked as verified if they weren't before
    user.isVerified = true;

    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("RESET_PASSWORD_POST_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}