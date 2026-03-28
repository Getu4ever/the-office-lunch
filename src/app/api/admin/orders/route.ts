import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { auth } from "@/auth";

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

/**
 * PATCH: Updates Order Status (Kitchen Workflow)
 * Triggered by DashboardOrders.tsx
 */
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await dbConnect();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status: body.status, 
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      status: updatedOrder.status 
    });

  } catch (error: any) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json({ error: 'Update failed', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    await dbConnect();

    // BRANCH 1: KITCHEN TEST ORDER
    if (body.type === 'TEST_ORDER_CREATE') {
      const testOrder = new Order({
        orderId: `TEST-${Math.random().toString(36).toUpperCase().slice(-4)}`,
        userEmail: body.userEmail || "test@example.com",
        userName: body.userName || "TEST SYSTEM",
        addressLine1: body.addressLine1 || "123 Test Street",
        telephone: body.telephone || "0000000000",
        eventDate: body.eventDate || new Date().toISOString().split('T')[0],
        deliverySlot: body.deliverySlot || "12:00 - 13:00",
        items: body.items || [],
        status: 'Paid', 
        total: body.total || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      try {
        const saved = await testOrder.save();
        return NextResponse.json({ success: true, orderId: saved.orderId }, { status: 201 });
      } catch (validationError: any) {
        console.error("SCHEMA VALIDATION FAILED:", validationError.errors);
        return NextResponse.json({ error: 'Validation Failed', details: validationError.message }, { status: 400 });
      }
    }

    // BRANCH 2: REAL CUSTOMER ORDER
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const calculatedTotal = body.items.reduce((acc: number, item: any) => 
      acc + (Number(item.price) * Number(item.quantity)), 0
    );

    const newOrder = new Order({
      ...body,
      orderId: `ORD-${Math.random().toString(36).toUpperCase().slice(-6)}`, 
      userEmail: body.userEmail || session?.user?.email || 'Guest',
      userName: body.userName || session?.user?.name || 'Guest Customer',
      status: body.status || 'Paid', 
      total: calculatedTotal,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    
    // Update stock
    await Promise.all(body.items.map(async (item: any) => {
      const productId = item.id || item._id;
      if (productId) {
        await Product.findByIdAndUpdate(productId, { 
          $inc: { stock: -Math.abs(item.quantity), sellCount: Math.abs(item.quantity) } 
        });
      }
    }));

    return NextResponse.json({ success: true, orderId: savedOrder.orderId }, { status: 201 });

  } catch (error: any) {
    console.error("CRITICAL POST ERROR:", error);
    return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500 });
  }
}