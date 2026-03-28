import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { auth } from "../../auth/[...nextauth]/route";
import fs from 'fs';
import path from 'path';

// GET: Fetch products for the Availability Manager
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ category: 1, name: 1 });
    return NextResponse.json(products || [], { status: 200 });
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}

// POST: Handles 88-item Sync, Individual Toggles, and New Items
export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();

  try {
    const body = await req.json();

    // ACTION: BULK SYNC 88 ITEMS
    if (body.action === "seed_88_items") {
      const jsonPath = path.join(process.cwd(), 'data', 'menu-seed.json');
      if (!fs.existsSync(jsonPath)) {
        return NextResponse.json({ error: "menu-seed.json not found" }, { status: 404 });
      }

      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const menuData = JSON.parse(rawData);

      // Wipe old data to clear validation/enum conflicts
      await Product.deleteMany({});

      const flatItems: any[] = [];
      Object.entries(menuData).forEach(([category, items]: [string, any]) => {
        if (Array.isArray(items)) {
          items.forEach(item => {
            flatItems.push({
              ...item,
              category,
              isAvailable: true,
              stock: 50,
              sellCount: 0
            });
          });
        }
      });

      const result = await Product.insertMany(flatItems);
      return NextResponse.json({ message: "Sync Success", count: result.length }, { status: 201 });
    }

    // ACTION: TOGGLE AVAILABILITY (For the Manager Buttons)
    if (body.action === "toggle_status") {
      const { id, isAvailable } = body;
      const updated = await Product.findByIdAndUpdate(id, { isAvailable }, { new: true });
      return NextResponse.json(updated, { status: 200 });
    }

    // DEFAULT: Add single product from form
    const newProduct = await Product.create({
      ...body,
      isAvailable: true,
      sellCount: 0
    });
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error: any) {
    console.error("POST API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}