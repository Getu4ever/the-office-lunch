import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User"; // Using the named export as per your file
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Reset code sent if account exists" }, { status: 200 });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); 

    // MATCHING YOUR SCHEMA: resetToken and resetTokenExpires
    user.resetToken = resetCode;
    user.resetTokenExpires = resetExpiry;
    await user.save();

    await resend.emails.send({
      from: 'The Office Lunch <info@karoldigital.co.uk>',
      to: email,
      subject: 'Password Reset Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 500px; margin: auto;">
          <h2 style="color: #b32d3a; text-transform: uppercase;">Password Reset</h2>
          <p>Your password reset code is:</p>
          <div style="background: #f5f0e6; padding: 30px; text-align: center; border-radius: 12px; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1a1a1a;">${resetCode}</span>
          </div>
          <p style="font-size: 12px; color: #999;">Valid for 15 minutes.</p>
        </div>
      `
    });

    return NextResponse.json({ message: "Reset code sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}