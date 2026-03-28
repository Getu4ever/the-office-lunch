import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from "@/auth";

/**
 * FILE: api/admin/orders/[id]/route.ts
 * Logic: Updates the order status for the professional tracker.
 */

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Security Check
    const session = await auth();
    
    // session.user.role check ensures only admins can move the tracker
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized Access" }, 
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    
    // Normalize status to lowercase to match OrderTracker expectations
    // e.g., "Preparing" becomes "preparing"
    const status = body.status?.toLowerCase().replace(/\s+/g, '-');

    if (!status) {
      return NextResponse.json(
        { error: "Status update value is required" }, 
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. Update the Order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" }, 
        { status: 404 }
      );
    }

    // 3. Return success
    return NextResponse.json({
      success: true,
      message: `Order ${id} updated to ${status}`,
      order: {
        id: updatedOrder._id,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt
      }
    });

  } catch (error: any) {
    console.error("ORDER_UPDATE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}