import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from "@/auth";

// 1. Define an interface to solve the 'any' and property missing errors
interface IOrder {
  _id: string;
  orderId?: string;
  userEmail: string;
  userId: string;
  eventDate?: string;
  createdAt: Date;
  items: any[];
  total: number;
  deliveryFee?: number;
  status: string;
  address: string;
  telephone: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 2. Params is now a Promise in recent Next.js versions
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Await params to get the ID
    const { id } = await params;
    
    await dbConnect();

    // 4. Type the found order
    const order = await Order.findById(id).lean() as unknown as IOrder;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 5. Security Check
    const isOwner = session.user.email === order.userEmail || session.user.id === order.userId;
    const isAdmin = (session.user as any).role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 6. Return cleaned data for the PDF
    return NextResponse.json({
      orderNumber: (order.orderId || String(order._id)).slice(-6).toUpperCase(),
      customerName: session.user.name,
      date: order.eventDate || new Date(order.createdAt).toLocaleDateString(),
      items: order.items,
      subtotal: order.total - (order.deliveryFee || 0),
      deliveryFee: order.deliveryFee || 0,
      total: order.total,
      status: order.status,
      address: order.address,
      telephone: order.telephone
    });

  } catch (error) {
    console.error("RECEIPT_FETCH_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}