import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from "@/auth";

/**
 * FILE: api/admin/orders/[id]/route.ts
 * Logic: Updates the order status with Next.js 16 Promise-based params support.
 */

export async function PATCH(
  request: NextRequest,
  // Next.js 16 requirement: context.params is a Promise
  context: { params: Promise<{ id: string }> } 
) {
  try {
    // 1. Await params to get the ID (CRITICAL FIX)
    const { id } = await context.params;

    // 2. Security Check
    const session = await auth();
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized Access" }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Normalize status (e.g., "Preparing" -> "preparing")
    const status = body.status?.toLowerCase().replace(/\s+/g, '-');

    if (!status) {
      return NextResponse.json(
        { error: "Status update value is required" }, 
        { status: 400 }
      );
    }

    await dbConnect();

    // 3. Update the Order
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

    // 4. Return success
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