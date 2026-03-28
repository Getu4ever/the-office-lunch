import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // 1. Session & Identity Check
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    // 2. Input Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    await dbConnect();

    // 3. Fetch User (Include password field which is often hidden by default in schemas)
    const user = await User.findOne({ email: session.user.email }).select("+password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. OAuth Protection
    // If user signed up with Google/GitHub, they might not have a password hash.
    if (!user.password) {
      return NextResponse.json({ 
        error: "Accounts created via Social Login do not have a password to change." 
      }, { status: 400 });
    }

    // 5. Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // 6. Hash New Password & Save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ 
      success: true,
      message: "Password updated successfully" 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Password Update Error:", error);
    return NextResponse.json({ 
      error: "Failed to update password",
      details: error.message 
    }, { status: 500 });
  }
}