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

    // Security: Don't confirm if user exists to prevent data mining
    if (!user) {
      return NextResponse.json({ message: "Reset code sent if account exists" }, { status: 200 });
    }

    // 2. Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 3. Save code to user record (using the fields from your specific model)
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = resetExpiry;
    await user.save();

    // 4. Send the email
    try {
      await resend.emails.send({
        from: 'The Office Lunch <info@karoldigital.co.uk>',
        to: email,
        subject: 'Password Reset Code',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 20px; max-width: 500px; margin: auto;">
            <h2 style="color: #b32d3a; text-transform: uppercase; letter-spacing: -1px;">Password Reset</h2>
            <p style="color: #666;">Use the code below to reset your password. It expires in 15 minutes.</p>
            <div style="background: #fdfaf5; padding: 40px; text-align: center; border-radius: 20px; margin: 20px 0; border: 1px solid #f1ece1;">
              <span style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #1a1a1a; font-family: monospace;">${resetCode}</span>
            </div>
            <p style="font-size: 11px; color: #999; line-height: 1.5;">
              If you didn't request this, please ignore this email or contact support if you have concerns.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("RESEND_ERROR:", emailError);
      // We don't return error here so user doesn't know if email failed
    }

    return NextResponse.json({ message: "Reset code sent" }, { status: 200 });
  } catch (error: any) {
    console.error("FORGOT_PASSWORD_CRITICAL_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}