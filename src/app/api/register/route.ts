import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User"; // Fixed to match your auth.ts import style
import bcrypt from "bcryptjs";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // Standardized env name

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // If the user is already verified (either via Email or Google), block registration
      if (existingUser.isVerified || existingUser.emailVerified) {
        return NextResponse.json(
          { message: "An account with this email already exists. Please login." }, 
          { status: 400 }
        );
      } 
      
      // If the user exists but is NOT verified AND doesn't have a Google ID, 
      // delete the old record to start fresh
      await User.deleteOne({ _id: existingUser._id });
    }

    // 2. Prepare credentials
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // 3. Create the new unverified user
    await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: codeExpiry,
      role: "customer"
    });

    console.log(`📩 VERIFICATION CODE FOR ${email}: ${verificationCode}`);

    // 4. Send verification email via Resend
    try {
      await resend.emails.send({
        from: 'The Office Lunch <info@karoldigital.co.uk>',
        to: email,
        subject: 'Verify your account',
        text: `Welcome to The Office Lunch. Your verification code is: ${verificationCode}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #b32d3a; text-transform: uppercase; letter-spacing: -1px;">The Office Lunch</h2>
            <p style="color: #333; font-size: 16px;">Hi ${name},</p>
            <p style="color: #666;">Use the 6-digit code below to verify your account and start ordering:</p>
            <div style="background: #f5f0e6; padding: 30px; text-align: center; border-radius: 12px; margin: 20px 0;">
              <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1a1a1a;">${verificationCode}</span>
            </div>
            <p style="font-size: 12px; color: #999; line-height: 1.5;">
              This code expires in 1 hour. If you did not request this, please ignore this email.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("❌ RESEND ERROR:", emailError);
      // We don't return error here because the user is already created in DB
    }

    return NextResponse.json({ message: "Registration successful! Check your email." }, { status: 201 });
  } catch (error: any) {
    console.error("REGISTRATION_POST_ERROR:", error);
    return NextResponse.json({ message: error.message || "Internal server error." }, { status: 500 });
  }
}