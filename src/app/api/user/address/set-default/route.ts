import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { addressId } = await req.json();
    await dbConnect();

    // 1. Set all addresses for this user to isDefault: false
    // 2. Set the chosen addressId to isDefault: true
    await User.updateOne(
      { email: session.user.email },
      { $set: { "addresses.$[].isDefault": false } }
    );

    await User.updateOne(
      { email: session.user.email, "addresses._id": addressId },
      { $set: { "addresses.$.isDefault": true } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}