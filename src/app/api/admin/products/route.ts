import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { auth } from "@/auth"; 
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();
    // Ensuring we fetch all fields including stock and homeTab
    const products = await Product.find({}).sort({ category: 1, name: 1 }).lean();
    return NextResponse.json(products || [], { status: 200 });
  } catch (error: any) {
    console.error("GET API Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();

  try {
    const body = await req.json();

    // --- ACTION: SEED 88 ITEMS ---
    if (body.action === "seed_88_items") {
      const jsonPath = path.join(process.cwd(), 'data', 'menu-seed.json');
      
      if (!fs.existsSync(jsonPath)) {
        return NextResponse.json({ error: "menu-seed.json not found" }, { status: 404 });
      }

      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const menuData = JSON.parse(rawData);

      await Product.deleteMany({});

      const flatItems: any[] = [];
      
      Object.entries(menuData).forEach(([categoryName, items]: [string, any]) => {
        if (Array.isArray(items)) {
          items.forEach(item => {
            flatItems.push({
              name: item.name,
              description: item.description,
              price: typeof item.price === 'string' 
                ? parseFloat(item.price.replace(/[£,]/g, '')) 
                : item.price,
              category: categoryName,
              homeTab: item.homeTab || "", 
              image: item.image || '/placeholder.jpg',
              isAvailable: true,
              stock: item.stock ?? 50, // Use JSON stock or default to 50
              sellCount: 0,
              allergens: item.allergens || [],
              calories: item.calories || 0,
            });
          });
        }
      });

      const result = await Product.insertMany(flatItems);
      return NextResponse.json({ message: "Menu rebuilt!", count: result.length }, { status: 201 });
    }

    // --- ACTION: TOGGLE AVAILABILITY ---
    if (body.action === "toggle_status") {
      const { id, isAvailable } = body;
      const updated = await Product.findByIdAndUpdate(id, { isAvailable }, { new: true });
      return NextResponse.json(updated || { error: "Not found" }, { status: 200 });
    }

    // --- DEFAULT: CREATE NEW PRODUCT ---
    const newProduct = await Product.create({
      ...body,
      homeTab: body.homeTab || "", 
      stock: body.stock !== undefined ? Number(body.stock) : 50,
      isAvailable: true,
      sellCount: 0
    });
    
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error: any) {
    console.error("POST API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Added explicit PUT for updates (Dashboard Edit functionality)
export async function PUT(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) return NextResponse.json({ error: "ID required for update" }, { status: 400 });

        const updatedProduct = await Product.findByIdAndUpdate(
            _id,
            { 
                ...updateData, 
                // Ensure numbers are handled correctly
                price: parseFloat(updateData.price),
                stock: parseInt(updateData.stock),
                updatedAt: new Date() 
            },
            { new: true }
        );

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}