import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { auth } from "@/auth"; // Updated to use your central auth config

// Helper for Admin Auth - Centralized logic
async function isAdmin() {
  const session = await auth();
  return session?.user && (session.user as any).role === "admin";
}

// 1. UPDATE PRODUCT (PUT)
export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await context.params; // Await params for Next.js 16
    const body = await request.json();
    
    if (body.price) {
      body.price = Number(parseFloat(body.price).toFixed(2));
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, { 
      new: true,
      runValidators: true 
    });
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PRODUCT_PUT_ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 2. AVAILABILITY TOGGLE (PATCH)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await context.params; // Await params for Next.js 16
    const body = await request.json();

    // Specifically for dashboard toggles (isAvailable, isFeatured, etc.)
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { $set: body }, 
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PRODUCT_PATCH_ERROR:", error);
    return NextResponse.json({ error: "Patch failed" }, { status: 500 });
  }
}

// 3. DELETE PRODUCT (DELETE)
export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await context.params; // Await params for Next.js 16
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("PRODUCT_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}