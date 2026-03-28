import { NextResponse } from "next/server";
import getServerSession from "next-auth"; 
import { authOptions } from "@/lib/auth"; 
import connectDB from "@/lib/mongodb"; 
import mongoose from "mongoose";

// Schema definition
const SettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: mongoose.Schema.Types.Mixed,
});

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export async function GET() {
  try {
    await connectDB();
    const status = await Settings.findOne({ key: "isKitchenOpen" });
    return NextResponse.json({ isOpen: status?.value ?? true });
  } catch (error) {
    return NextResponse.json({ isOpen: true }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Fix for ts(2339): Cast the result to 'any' to expose the .user property
  const session = await (getServerSession as any)(authOptions);

  // Check admin role safely
  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ message: "UNAUTHORIZED: ADMIN ONLY" }, { status: 401 });
  }

  try {
    await connectDB();
    const { isOpen } = await req.json();

    await Settings.findOneAndUpdate(
      { key: "isKitchenOpen" },
      { value: isOpen },
      { upsert: true }
    );
    
    return NextResponse.json({ message: "KITCHEN STATUS UPDATED", isOpen });
  } catch (error) {
    return NextResponse.json({ message: "DATABASE ERROR" }, { status: 500 });
  }
}