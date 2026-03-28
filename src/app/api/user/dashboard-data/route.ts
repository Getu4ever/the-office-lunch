import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Get the user from the database
    const userData = await User.findOne({ email: session.user.email }).lean();

    if (!userData) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const dbUser = userData as any;
    // Convert ObjectId to String to match how the Webhook saves it
    const userIdString = dbUser._id.toString();

    // 2. Fetch Orders
    // We search by the string ID (from Webhook) OR the user's email
    const rawOrders = await Order.find({ 
      $or: [
        { userId: userIdString },
        { userEmail: session.user.email }
      ]
    })
    .sort({ createdAt: -1 })
    .lean();

    // 3. Serialize data for the frontend (handling Dates and ObjectIds)
    const serializedOrders = rawOrders.map((order: any) => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : new Date().toISOString(),
      // Ensure the items array exists for the DashboardOrders component
      items: order.items || []
    }));

    const finalUser = {
      ...dbUser,
      _id: userIdString,
      image: dbUser?.image || session.user.image || null
    };

    return NextResponse.json({ 
      user: finalUser, 
      orders: serializedOrders 
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Dashboard Data Error:", error);
    return NextResponse.json({ 
      error: "Failed to load dashboard data",
      details: error.message 
    }, { status: 500 });
  }
}