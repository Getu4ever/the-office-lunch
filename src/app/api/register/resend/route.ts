import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { Resend } from 'resend';

const resend = new Resend(process.env.CATERING_APP_PROD);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate new code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.verificationCode = newCode;
    user.verificationCodeExpires = newExpiry;
    await user.save();

    await resend.emails.send({
      from: 'The Office Lunch <info@karoldigital.co.uk>',
      to: email,
      subject: 'Your new verification code',
      html: `<p>Your new code is: <strong>${newCode}</strong></p>`
    });

    return NextResponse.json({ message: "New code sent!" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to resend code" }, { status: 500 });
  }
}