import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // Use 'image' to match your frontend: JSON.stringify({ image: newImageUrl })
    const { image } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // A safer check: just ensure it's actually coming from Cloudinary
    if (!image.includes("cloudinary.com")) {
       return NextResponse.json({ error: "Invalid image source" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { image: image } },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      image: updatedUser.image 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}