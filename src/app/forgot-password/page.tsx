import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // 1. Find user
    const user = await User.findOne({ email });

    // For security, if user doesn't exist, we still return "Success" 
    // to prevent email harvesting. But we only send the email if they exist.
    if (!user) {
      return NextResponse.json({ message: "Reset code sent if account exists" }, { status: 200 });
    }

    // 2. Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // 3. Save code to user record
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = resetExpiry;
    await user.save();

    // 4. Send the email
    try {
      await resend.emails.send({
        from: 'The Office Lunch <info@karoldigital.co.uk>',
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${resetCode}. It expires in 15 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 500px; margin: auto;">
            <h2 style="color: #b32d3a; text-transform: uppercase;">Password Reset</h2>
            <p>We received a request to reset your password. Use the code below to proceed:</p>
            <div style="background: #f5f0e6; padding: 30px; text-align: center; border-radius: 12px; margin: 20px 0;">
              <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1a1a1a;">${resetCode}</span>
            </div>
            <p style="font-size: 12px; color: #999; line-height: 1.5;">
              This code is valid for 15 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("RESET_EMAIL_ERROR:", emailError);
    }

    return NextResponse.json({ message: "Reset code sent" }, { status: 200 });
  } catch (error: any) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}