import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json();

    // 1. Validation: Don't even hit the DB if fields are missing
    if (!email || !code || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    // 2. Security: Find user with code AND ensure it hasn't expired
    const user = await User.findOne({
      email: email.toLowerCase(), // Ensure case-insensitivity
      resetToken: code,
      resetTokenExpires: { $gt: new Date() }, // Check if expiry is in the future
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired recovery code" }, { status: 400 });
    }

    // 3. Hashing: 12 rounds is the industry standard for production
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    
    // 4. Cleanup: Use $unset or undefined to prevent the code from being used again
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    user.isVerified = true;

    await user.save();

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("RESET_PASSWORD_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}