import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 1. Establish database connection immediately
    await dbConnect();

    // 2. Validate Session
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Parse and Validate Body
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: "Valid Image URL is required" }, { status: 400 });
    }

    // Security: Ensure it's a secure URL (Optional but recommended)
    if (!imageUrl.startsWith('https://res.cloudinary.com')) {
       return NextResponse.json({ error: "Invalid image source" }, { status: 400 });
    }

    // 4. Atomic Update
    // We update the 'image' field specifically to match the User model
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { image: imageUrl } },
      { 
        new: true, // Return the document AFTER update
        runValidators: true // Ensure the new URL meets schema requirements
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // 5. Success Response
    return NextResponse.json({ 
      success: true,
      message: "Profile image updated successfully", 
      image: updatedUser.image 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Critical Update Error:", error);
    
    return NextResponse.json({ 
      error: "Failed to update profile image",
      details: error.message 
    }, { status: 500 });
  }
}